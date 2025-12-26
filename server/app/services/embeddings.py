import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Make OpenAI client optional - only initialize if API key is provided
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key) if openai_api_key and openai_api_key != "your_openai_api_key_here_optional" else None


def embed_texts(texts):
    """
    Convert list of texts into embeddings.
    """
    if not client:
        # Return empty embeddings or raise error if OpenAI is not configured
        print("Warning: OpenAI API key not configured. Embeddings disabled.")
        return [[0.0] * 1536 for _ in texts]  # Return dummy embeddings
    
    response = client.embeddings.create(model="text-embedding-3-small", input=texts)
    return [item.embedding for item in response.data]
