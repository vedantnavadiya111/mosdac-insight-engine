from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import jwt
import os

load_dotenv()

from app.services.ai_chatbot import chatbot_response
from app.schemas.chat import ChatRequest, ChatResponse, ChatHistoryResponse, ChatMessage
from app.db.session import get_db
from app.models.user import User
from app.models.chat_context import ChatContext

from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid JWT token"
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid JWT token"
        )

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return user


@router.post("/", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Protected chatbot endpoint. Requires valid JWT.
    Chat history is saved per user.
    """
    answer = chatbot_response(request.query, user_id=current_user.id, db=db)
    return ChatResponse(
        user_id=current_user.id,
        query=request.query,
        answer=answer,
    )


@router.get("/history", response_model=ChatHistoryResponse)
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fetch full chat history for the current user.
    """
    messages = (
        db.query(ChatContext)
        .filter(ChatContext.user_id == current_user.id)
        .order_by(ChatContext.id.asc())
        .all()
    )

    history = [ChatMessage(role=m.role, content=m.content) for m in messages]

    return ChatHistoryResponse(user_id=current_user.id, history=history)
