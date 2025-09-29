from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import uuid
import os

qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL", "http://localhost:6333"),
    api_key=os.getenv("QDRANT_API_KEY"),  # optional, if running locally
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


def upsert_chunks(chunks, embeddings):
    """
    Store chunks with embeddings in Qdrant
    """

    points = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "url": chunk.get("url", ""),
                    "title": chunk.get("title", ""),
                    "content": chunk.get("content", ""),
                    "chunk_id": chunk.get("chunk_id", i),
                },
            )
        )

    try:
        operation_info = qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=points,
            wait=True,
        )
        print(f"✅ Inserted {len(points)} chunks into {COLLECTION_NAME}")
        return operation_info
    except Exception as e:
        print(f"❌ Failed to insert chunks: {e}")
        raise
