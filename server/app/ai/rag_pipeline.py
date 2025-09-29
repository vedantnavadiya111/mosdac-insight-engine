from dotenv import load_dotenv
import os
from openai import OpenAI
from app.ai.retriever import retrieve

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)


def generate_answer(query: str, top_k: int = 5) -> str:
    """
    Full RAG pipeline:
    - Retrieve chunks
    - Construct context
    - Ask LLM to answer based on retrieved context
    """
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
