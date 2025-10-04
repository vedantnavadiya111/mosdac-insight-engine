import os
from typing import List, Dict
from dotenv import load_dotenv
from openai import OpenAI
from sqlalchemy.orm import Session
from app.vector_db.qdrant_client import search_chunks
from app.models.chat_context import ChatContext

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)


def build_prompt(
    query: str, context_chunks: List[Dict], chat_history: List[ChatContext]
) -> str:
    """
    Build a prompt with both context (Qdrant) and user chat history
    """
    context_texts = "\n\n".join([c["content"] for c in context_chunks])

    history_texts = "\n".join(
        [f"{c.role.capitalize()}: {c.content}" for c in chat_history]
    )

    prompt = f"""
    You are an AI assistant answering questions about MOSDAC datasets and content.

    Relevant Context from MOSDAC:
    {context_texts}

    Previous Conversation:
    {history_texts}

    User Question:
    {query}

    Answer clearly, factually, and based only on the MOSDAC context above
    and the conversation history with this user.
    If the answer is not in context, say: "I could not find relevant information in MOSDAC data."
    """
    return prompt.strip()


def chatbot_response(query: str, user_id: int, db: Session, top_k: int = 5) -> str:
    """
    Generate chatbot response using Qdrant + LLM.
    Persists chat history in Postgres per user.
    """
    history = (
        db.query(ChatContext)
        .filter(ChatContext.user_id == user_id)
        .order_by(ChatContext.id.asc())
        .all()
    )

    hits = search_chunks(query, top_k=top_k)

    if not hits:
        answer = "No relevant context found in MOSDAC database."
        db.add(ChatContext(user_id=user_id, role="user", content=query))
        db.add(ChatContext(user_id=user_id, role="assistant", content=answer))
        db.commit()
        return answer

    prompt = build_prompt(query, hits, history)

    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            n=1,
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": query},
            ],
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        return f"LLM call failed: {e}"

    db.add(ChatContext(user_id=user_id, role="user", content=query))
    db.add(ChatContext(user_id=user_id, role="assistant", content=answer))
    db.commit()

    return answer
