from fastapi import FastAPI
from app.routes import chat, auth
from app.db.session import engine
from app.db import base

app = FastAPI(title="ISRO SagarMegh AI Backend")

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/chat", tags=["Chatbot"])


@app.get("/")
def root():
    return {"message": "Hello from MOSDAC!"}


@app.on_event("startup")
def on_startup():
    base.Base.metadata.create_all(bind=engine)
