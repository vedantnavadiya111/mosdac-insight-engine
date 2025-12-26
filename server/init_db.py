"""
Initialize database tables for ISRO SagarMegh AI
"""
from app.db.session import engine
from app.db.base import Base

# Import all models to register them with Base
from app.models.user import User
from app.models.chat_context import ChatContext
from app.models.download import DownloadJob

def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")

if __name__ == "__main__":
    init_db()
