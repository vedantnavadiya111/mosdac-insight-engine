from fastapi import FastAPI
from app.api import routes_scraping, routes_query

app = FastAPI(title="MOSDAC Bot Backend")


@app.get("/")
def root():
    return {"message": "Welcome to the API!"}


@app.get("/stats")
def get_stats():
    """
    Quick stats for demo purposes
    """
    return {
        "service": "MOSDAC AI Bot",
        "status": "operational",
        "features": [
            "Smart web scraping",
            "Vector search",
            "AI-powered responses",
            "PDF content extraction",
        ],
    }


app.include_router(routes_scraping.router, prefix="/scraping", tags=["Scraping"])
app.include_router(routes_query.router, prefix="/chat", tags=["Chatbot"])
