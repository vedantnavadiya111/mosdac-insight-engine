from fastapi import APIRouter, Query
from app.scraping.crawler import crawl_website
from app.scraping.scraper import extract_text_from_url
from app.scraping.preprocess import clean_text
from app.db.qdrant_client import upsert_chunks

router = APIRouter()


@router.post("/scrape/run")
async def run_scraper(
    base_url: str = Query(
        default="https://mosdac.gov.in", description="Base URL to crawl"
    )
):
    """
    Trigger the scrapping pipeline:
    1. Crawl URLs
    2. Scrape
    3. Preprocess (chunking, cleaning)
    4. Push to Qdrant
    """
    try:
        urls = crawl_website(base_url)

        all_chunks = []
        for url in urls:
            raw_text = extract_text_from_url(url)
            if not raw_text:
                continue
            chunks = clean_text(raw_text)
            all_chunks.extend(chunks)

        if not all_chunks:
            return {"status": "ok", "message": "No content extracted"}

        upsert_chunks(all_chunks)

        return {
            "status": "ok",
            "message": f"Scraping completed. Inserted {len(all_chunks)} chunks into Qdrant.",
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
