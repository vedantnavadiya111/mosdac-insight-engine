from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from app.ai.rag_pipeline import (
    generate_answer,
    generate_answer_with_history,
    conversation_manager,
)

router = APIRouter()


class ChatRequest(BaseModel):
    query: str
    session_id: str = None


class ChatResponse(BaseModel):
    answer: str
    session_id: str


@router.post("/query", response_model=ChatResponse)
async def chat_query(request: ChatRequest):
    """
    Query the MOSDAC RAG chatbot with conversation history support.
    """
    try:
        answer, session_id = generate_answer_with_history(
            query=request.query, session_id=request.session_id, top_k=5
        )
        return ChatResponse(answer=answer, session_id=session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")


@router.post("/clear-history")
async def clear_history(session_id: str):
    """
    Clear conversation history for a specific session.
    """
    conversation_manager.clear_history(session_id)
    return {"message": "Conversation history cleared"}


@router.get("/query")
async def query_bot(q: str = Query(..., description="User query to MOSDAC bot")):
    """
    Query the MOSDAC RAG chatbot (GET endpoint - no session history).
    """
    try:
        answer = generate_answer(q)
        return {"status": "ok", "query": q, "answer": answer}
    except Exception as e:
        return {"status": "error", "message": str(e)}
