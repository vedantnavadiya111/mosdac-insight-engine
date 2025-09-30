from fastapi import FastAPI
from app.api import routes_scraping, routes_query

app = FastAPI(title="MOSDAC Bot Backend")


@app.get("/")
def root():
    return {"message": "Welcome to the API!"}


app.include_router(routes_scraping.router, prefix="/scraping", tags=["Scraping"])
app.include_router(routes_query.router, prefix="/chat", tags=["Chatbot"])
