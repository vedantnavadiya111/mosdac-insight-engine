from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import uuid
import os
from app.services.embeddings import embed_texts

load_dotenv()

qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL", "http://localhost:6333"),
    api_key=os.getenv("QDRANT_API_KEY"),  # optional, if running locally
    timeout=60.0,
)

COLLECTION_NAME = "mosdac_chunks"


def init_collection(vector_size: int):
    """
    Create collection if not exists
    """
    try:
        if not qdrant.collection_exists(COLLECTION_NAME):
            qdrant.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
            )
            print(f"✅ Created collection {COLLECTION_NAME}")
        else:
            print(f"📁 Collection {COLLECTION_NAME} already exists")
    except Exception as e:
        print(f"❌ Collection initialization error: {e}")
        raise


def upsert_chunks(chunks, embeddings, batch_size=100):
    """
    Store chunks with embeddings in Qdrant in batches.
    """
    total = len(chunks)
    for i in range(0, total, batch_size):
        batch_chunks = chunks[i : i + batch_size]
        batch_embeddings = embeddings[i : i + batch_size]

        points = [
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "url": chunk.get("url", ""),
                    "title": chunk.get("title", ""),
                    "content": chunk.get("content", ""),
                    "chunk_id": chunk.get("chunk_id", j + i),
                },
            )
            for j, (chunk, embedding) in enumerate(zip(batch_chunks, batch_embeddings))
        ]

        try:
            qdrant.upsert(
                collection_name=COLLECTION_NAME,
                points=points,
                wait=True,
            )
            print(f"✅ Inserted {len(points)} chunks (batch {i//batch_size + 1})")
        except Exception as e:
            print(f"❌ Failed to insert batch {i//batch_size + 1}: {e}")
            raise


def search_chunks(query: str, top_k=5):
    """
    Search Qdrant for most relevant chunks based on query.
    Returns list of payloads (url, title, content).
    """
    try:
        query_embedding = embed_texts([query])[0]

        results = qdrant.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            limit=top_k,
        )

        hits = [hit.payload for hit in results]
        return hits

    except Exception as e:
        print(f"Qdrant search failed: {e}")
        return []
