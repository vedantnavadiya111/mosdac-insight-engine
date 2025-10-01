from dotenv import load_dotenv
import os
from typing import Dict, List, Tuple
from openai import OpenAI
from app.ai.retriever import retrieve
from app.prompts.prompt1 import PROMPT1

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)


class ConversationHistory:
    def __init__(self, max_history: int = 10):
        self.max_history = max_history
        self.coversations = {}

    def add_message(self, session_id: str, role: str, content: str):
        if session_id not in self.coversations:
            self.coversations[session_id] = []

        self.coversations[session_id].append({"role": role, "content": content})

        # keep only recent history
        if len(self.coversations[session_id]) > self.max_history:
            self.coversations[session_id] = self.coversations[session_id][
                -self.max_history :
            ]

    def get_recent_history(self, session_id: str, last_n: int = 3) -> List[Dict]:
        if session_id not in self.coversations:
            return []
        return self.coversations[session_id][-last_n:]

    def clear_history(self, session_id: str):
        if session_id in self.coversations:
            del self.coversations[session_id]


conversation_manager = ConversationHistory()


def check_static_prompt(query: str) -> str | None:
    """
    Check if the query matches predefined prompts in PROMPT1.
    Returns the matched answer or None if not found.
    """
    q_lower = query.lower()
    for keywords, answer in PROMPT1.items():
        if any(kw in q_lower for kw in keywords):
            return answer.strip()
    return None


def generate_answer_with_history(
    query: str, session_id: str = None, top_k: int = 5
) -> Tuple[str, str]:
    """
    Enhanced RAG pipeline with conversation history
    Returns: (answer, session_id)
    """
    # if no session_id provided, use basic rag without history
    if not session_id:
        answer = generate_answer_without_history(query, top_k)
        return answer, "no-session"

    conversation_manager.add_message(session_id, "user", query)

    # check static prompts first
    static_answer = check_static_prompt(query)
    if static_answer:
        answer = f"\n{static_answer}"
        conversation_manager.add_message(session_id, "assistant", answer)
        return answer, session_id

    # get conversation history for context (only for this session)
    recent_history = conversation_manager.get_recent_history(session_id, last_n=3)

    docs = retrieve(query, top_k=top_k)

    if not docs:
        answer = "❌ No relevant information found in knowledge base."
        conversation_manager.add_message(session_id, "assistant", answer)
        return answer, session_id

    context = "\n\n".join([f"- {d['content']}" for d in docs])

    messages = build_conversation_prompt(context, query, recent_history)

    response = client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=messages,
    )

    answer = response.choices[0].message.content.strip()

    conversation_manager.add_message(session_id, "assistant", answer)

    return answer, session_id


def generate_answer_without_history(query: str, top_k: int = 5) -> str:
    """
    Basic RAG without conversation history (fallback)
    """
    static_answer = check_static_prompt(query)
    if static_answer:
        return f"\n{static_answer}"

    # retrieve docs
    docs = retrieve(query, top_k=top_k)

    if not docs:
        return "❌ No relevant information found in knowledge base."

    # construct context
    context = "\n\n".join([f"- {d['content']}" for d in docs])

    # prompt LLM
    prompt = f"""
    You are an AI assistant specialized in MOSDAC data.

    Context from documents:
    {context}

    Question: {query}

    Answer concisely and factually using the above context.
    """

    response = client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant for MOSDAC data queries.",
            },
            {"role": "user", "content": prompt},
        ],
    )

    return response.choices[0].message.content.strip()


def build_conversation_prompt(
    context: str, current_query: str, history: List[Dict]
) -> List[Dict]:
    """Build messages array with conversation history"""
    messages = [
        {
            "role": "system",
            "content": """You are a helpful assistant for MOSDAC data queries. 
            Use the provided context to answer questions. Maintain conversation flow and 
            reference previous exchanges when relevant. If the context doesn't contain 
            the answer, say you don't know.""",
        }
    ]

    # adding conversation history
    for msg in history:
        messages.append({"role": msg["role"], "content": msg["content"]})

    # add current context and query
    messages.append(
        {
            "role": "user",
            "content": f"""Based on this MOSDAC documentation context:
        {context}
        
        Please answer this question: {current_query}""",
        }
    )

    return messages


def generate_answer(query: str, top_k: int = 5) -> str:
    """Original function - now uses basic RAG without history"""
    return generate_answer_without_history(query, top_k)
