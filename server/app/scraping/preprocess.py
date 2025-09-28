import re
from typing import Dict, List


def clean_text(text: str) -> str:
    """
    Remove extra whitespace, newlines, etc.
    """
    return re.sub(r"\s+", " ", text).strip()


def chunk_text(data: Dict, chunk_size: int = 500) -> List[Dict]:
    """
    Split page content into small chunks.
    Returns list of dicts {url, title, chunk_id, content}
    """
    cleaned = clean_text(data["content"])
    words = cleaned.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk_words = words[i : i + chunk_size]
        chunk_text = " ".join(chunk_words)
        chunks.append(
            {
                "url": data["url"],
                "title": data["title"],
                "chunk_id": i // chunk_size,
                "content": chunk_text,
            }
        )
    return chunks
