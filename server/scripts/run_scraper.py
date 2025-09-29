import sys
import os
import time
from tqdm import tqdm

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.scraping.crawler import crawl_website
from app.scraping.scraper import extract_text_from_url
from app.scraping.preprocess import chunk_text
from app.ai.embedder import embed_texts
from app.db.qdrant_client import init_collection, upsert_chunks


def run_scrapper():
    base_url = "https://www.mosdac.gov.in"
    print(f"Starting scraper on {base_url}...\n")

    start_time = time.time()

    # crawl website for URLs
    print("🔍 Crawling website for URLs...")
    urls = crawl_website(base_url)
    print(f"Found {len(urls)} URLs to scrape\n")

    # scrape and chunk content
    all_chunks = []
    successful_urls = 0

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
        successful_urls += 1

        tqdm.write(f"✅ {url} → {len(chunks)} chunks ({time.time() - url_start:.2f}s)")

    scraping_time = time.time() - start_time
    print(
        f"\n📊 Scraping completed: {successful_urls}/{len(urls)} pages, {len(all_chunks)} chunks in {scraping_time:.2f}s"
    )

    if not all_chunks:
        print("❌ No content scraped. Exiting.")
        return

    # generate embeddings
    print("\n🧠 Generating embeddings...")
    embedding_start = time.time()

    texts = [c["content"] for c in all_chunks]

    try:
        embeddings = embed_texts(texts)
        embedding_time = time.time() - embedding_start
        print(f"✅ Generated {len(embeddings)} embeddings in {embedding_time:.2f}s")
    except Exception as e:
        print(f"❌ Embedding generation failed: {e}")
        return

    # initialize qdrant collection
    print("\n🗄️ Initializing vector database...")
    try:
        vector_size = len(embeddings[0])
        init_collection(vector_size)
        print(f"✅ Collection initialized with vector size: {vector_size}")
    except Exception as e:
        print(f"❌ Collection initialization failed: {e}")
        return

    # store in qdrant
    print("\n💾 Storing chunks in vector database...")
    db_start = time.time()

    try:
        upsert_chunks(all_chunks, embeddings)
        db_time = time.time() - db_start
        print(
            f"✅ Successfully stored {len(all_chunks)} chunks in database ({db_time:.2f}s)"
        )
    except Exception as e:
        print(f"❌ Database storage failed: {e}")
        return

    # final summary
    total_time = time.time() - start_time
    print(f"\n🎉 Pipeline completed successfully!")
    print(f"⏱️  Total time: {total_time:.2f}s")
    print(f"📄 Pages processed: {successful_urls}/{len(urls)}")
    print(f"🧩 Total chunks: {len(all_chunks)}")
    print(f"🔢 Vector dimensions: {len(embeddings[0])}")

    # preview first few chunks
    print("\n📋 Sample chunks (first 3):")
    for i, chunk in enumerate(all_chunks[:3]):
        print(f"{i+1}. {chunk['content'][:100]}...\n")


if __name__ == "__main__":
    run_scrapper()
