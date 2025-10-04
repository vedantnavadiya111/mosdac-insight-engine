from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class ChatContext(Base):
    __tablename__ = "chat_context"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    role = Column(Text, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)

    user = relationship("User", back_populates="chat_history")
