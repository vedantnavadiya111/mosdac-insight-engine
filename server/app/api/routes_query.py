from fastapi import APIRouter, Query
from app.ai.rag_pipeline import generate_answer

router = APIRouter()


@router.get("/query")
async def query_bot(q: str = Query(..., description="User query to MOSDAC bot")):
    """
    Query the MOSDAC RAG chatbot.
    """
    try:
        answer = generate_answer(q)
        return {"status": "ok", "query": q, "answer": answer}
    except Exception as e:
        return {"status": "error", "message": str(e)}
