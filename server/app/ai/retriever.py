from app.db.qdrant_client import qdrant, COLLECTION_NAME
from app.ai.embedder import embed_texts


def retrieve(query: str, top_k: int = 5):
    """
    Retrieve top_k relevant chunks from Qdrant for a query
    """
    # embed the query
    query_embedding = embed_texts([query])[0]

    # search in qdrant
    results = qdrant.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_embedding,
        limit=top_k,
    )

    # format results
    docs = []
    for r in results:
        docs.append(
            {
                "score": r.score,
                "url": r.payload.get("url", ""),
                "title": r.payload.get("title", ""),
                "content": r.payload.get("content", ""),
            }
        )

    return docs
