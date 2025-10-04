from pydantic import BaseModel
from typing import List


class ChatRequest(BaseModel):
    query: str


class ChatResponse(BaseModel):
    user_id: int
    query: str
    answer: str


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatHistoryResponse(BaseModel):
    user_id: int
    history: List[ChatMessage]
