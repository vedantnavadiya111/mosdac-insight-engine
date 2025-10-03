import os
from typing import List, Dict
from dotenv import load_dotenv
from openai import OpenAI
from app.vector_db.qdrant_client import search_chunks

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)


def build_prompt(query: str, context_chunks: List[Dict]) -> str:
    """
    Build a prompt with context from Qdrant
    """
    context_texts = "\n\n".join([c["content"] for c in context_chunks])

    prompt = f"""
    You are an AI assistant answering questions about MOSDAC datasets and content

    Context:
    {context_texts}

    User Question:
    {query}

    Answer clearly, factually, and based only on the context above.
    If the answer is not in context, say: "I could not find relevent information in MOSDAC data."
    """
    return prompt.strip()


def chatbot_response(query: str, top_k: int = 5) -> str:
    """
    Generate chatbot response using Qdrant + LLM
    """
    hits = search_chunks(query, top_k=top_k)

    if not hits:
        return "No relevent context found in MOSDAC database."

    prompt = build_prompt(query, hits)

    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            n=1,
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "You are a helpful AI assistant."},
            ],
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"LLM call failed: {e}"
