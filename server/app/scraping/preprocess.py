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


# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from typing import Dict


# def smart_chunk_text(data: Dict, chunk_size: int = 512, chunk_overlap: int = 50):
#     """
#     Better chunking preserving semantic boundaries
#     """
#     text_splitter = RecursiveCharacterTextSplitter(
#         chunk_size=chunk_size,
#         chunk_overlap=chunk_overlap,
#         length_function=len,
#         separators=["\n\n", "\n", ". ", " ", ""],
#     )

#     chunks = text_splitter.split_text(data["content"])

#     return [
#         {
#             "url": data["url"],
#             "title": data["title"],
#             "chunk_id": i,
#             "content": chunk,
#         }
#         for i, chunk in enumerate(chunks)
#     ]
