from fastapi import APIRouter
from app.services.ai_chatbot import chatbot_response
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["Chatbot"])


@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Chat endpoint: takes user query and returns AI response
    """
    answer = chatbot_response(request.query)
    return ChatResponse(user_id=request.user_id, query=request.query, answer=answer)
