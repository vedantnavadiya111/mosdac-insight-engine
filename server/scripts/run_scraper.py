import sys
import os
import time
from tqdm import tqdm

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.scraping.crawler import crawl_website
from app.scraping.scraper import extract_text_from_url
from app.scraping.preprocess import chunk_text


def run_scrapper():
    base_url = "https://www.mosdac.gov.in"
    print(f"Starting scraper on {base_url}...\n")

    start_time = time.time()
    urls = crawl_website(base_url)

    print(f"Found {len(urls)} URLs to scrape\n")

    all_chunks = []

    # tqdm loop
    for url in tqdm(urls, desc="Scraping pages", unit="page"):
        url_start = time.time()
        page_data = extract_text_from_url(url)

        if not page_data:
            tqdm.write(
                f"❌ Failed or empty page: {url} ({time.time() - url_start:.2f}s)"
            )
            continue

        chunks = chunk_text(page_data, chunk_size=200)
        all_chunks.extend(chunks)

        tqdm.write(f"✅ {url} → {len(chunks)} chunks ({time.time() - url_start:.2f}s)")

    total_time = time.time() - start_time
    print(
        f"\nScraped {len(all_chunks)} chunks from {len(urls)} pages in {total_time:.2f} seconds.\n"
    )

    # Preview first few chunks
    for c in all_chunks[:5]:
        print("Preview chunk:", c, "\n")


if __name__ == "__main__":
    run_scrapper()
