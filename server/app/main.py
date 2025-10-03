from fastapi import FastAPI
from app.routes import chat

app = FastAPI(title="ISRO SagarMegh AI Backend")

app.include_router(chat.router)


@app.get("/")
def root():
    return {"message": "Hello from MOSDAC!"}
