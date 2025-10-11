import os
from typing import List, Dict
from dotenv import load_dotenv
from openai import OpenAI
from sqlalchemy.orm import Session
from app.vector_db.qdrant_client import search_chunks
from app.models.chat_context import ChatContext

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)


def generate_hypothetical_answer(query: str) -> str:
    """
    Generate a hypothetical answer using HyDE approach.
    This creates an ideal answer that will be used for better vector search.
    """
    hyde_prompt = f"""
    You are a technical expert from MOSDAC (Meteorological and Oceanographic Satellite Data Archival Centre). 
    Based on your expertise, write a comprehensive, well-structured answer to the following question.
    
    Important: 
    - Write as if you are extracting information from official MOSDAC documentation and datasets
    - Use technical terminology appropriate for satellite data, remote sensing, and oceanography
    - Include specific details about datasets, instruments, parameters, and temporal/spatial coverage
    - Structure the answer with clear sections and bullet points where appropriate
    - Mention specific satellite missions (OCM, SCATSAT, INSAT, etc.) and data products
    
    Question: {query}
    
    Generate a detailed hypothetical answer:
    """

    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            messages=[
                {
                    "role": "system",
                    "content": "You are a MOSDAC domain expert creating hypothetical answers for retrieval enhancement.",
                },
                {"role": "user", "content": hyde_prompt},
            ],
            temperature=0.3,
            max_tokens=800,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"HyDE generation failed: {e}")
        return query


def build_enhanced_prompt(
    query: str,
    context_chunks: List[Dict],
    chat_history: List[ChatContext],
    hypothetical_answer: str = None,
) -> str:
    """
    Build an enhanced prompt with context, chat history, and HyDE information
    """
    context_texts = ""
    for i, chunk in enumerate(context_chunks, 1):
        source_info = chunk.get("metadata", {}).get("source", "Unknown")
        confidence = chunk.get("score", 0)
        context_texts += (
            f"[Context {i} - Source: {source_info}, Relevance: {confidence:.3f}]\n"
        )
        context_texts += f"{chunk['content']}\n\n"

    history_texts = ""
    if chat_history:
        recent_history = chat_history[-6:]
        history_texts = "Recent Conversation History:\n"
        for chat in recent_history:
            role = "User" if chat.role == "user" else "Assistant"
            history_texts += f"{role}: {chat.content}\n"

    system_prompt = f"""
        # MOSDAC Expert Assistant

        ## ROLE & PURPOSE
        You are an AI assistant specialized in MOSDAC (Meteorological and Oceanographic Satellite Data Archival Centre) datasets, satellite missions, and remote sensing data. Your primary role is to provide accurate, technical information about MOSDAC's data products and services.

        ## CONVERSATION EXAMPLES
        Here are some example interactions to guide your responses:

        **User:** "Hi" or "Hello"
        **Assistant:** "Hello! I'm your MOSDAC AI assistant. How can I help you with satellite data, weather information, or ocean monitoring today?"

        **User:** "What can you help me with?"
        **Assistant:** "I can help you with various MOSDAC services including satellite datasets (OCM, SCATSAT-1, INSAT-3D), weather data, ocean state parameters, and data download assistance. What specific information are you looking for?"

        **User:** "Tell me about weather data"
        **Assistant:** "MOSDAC provides comprehensive weather data from multiple satellite missions. I can help you understand available parameters, temporal coverage, spatial resolution, and data access methods. What specific weather parameter interests you?"

        **User:** "How do I download data?"
        **Assistant:** "MOSDAC offers various data download options through their portal. I can guide you through the download process, explain data formats, and help you select the right datasets for your needs. What type of data are you looking to download?"

        ## CONTEXT & GROUNDING
        You have access to the following information:

        ### RETRIEVED CONTEXT FROM MOSDAC DATABASE:
        {context_texts}

        ### CONVERSATION CONTEXT:
        {history_texts if history_texts else "No recent conversation history."}

        {'### HYPOTHETICAL ANSWER ANALYSIS:' if hypothetical_answer else ''}
        {'A hypothetical answer was generated to guide retrieval. Use this for understanding the query intent but verify all facts against the actual context above.' if hypothetical_answer else ''}

        ## RESPONSE GUIDELINES

        ### CONVERSATIONAL APPROACH:
        - For greetings, respond warmly and offer specific help
        - For general questions, provide overview and ask for specifics
        - Maintain a helpful, professional tone throughout

        ### DATA SPECIFICITY:
        - Reference specific satellite missions (OCM, SCATSAT-1, INSAT-3D, etc.)
        - Mention precise parameters (SST, Chlorophyll, Wind Vectors, Aerosols, etc.)
        - Include temporal and spatial coverage details when available
        - Reference specific data products and their applications

        ### RESPONSE STRUCTURE:
        1. Start with a direct answer to the core question
        2. Provide supporting details from the context
        3. Mention data sources and their relevance
        4. Suggest related datasets or parameters when appropriate

        ### QUALITY ASSURANCE:
        - Base answers STRICTLY on the provided context
        - If information is incomplete, acknowledge limitations
        - For technical queries, maintain scientific accuracy
        - Cross-reference multiple context chunks when available

        ### HANDLING UNCERTAINTY:
        If the context doesn't contain sufficient information, respond with:
        "I could not find specific information about this in the current MOSDAC data. The available context covers [mention what IS available], but doesn't address your specific question about [mention the gap]."

        ## CURRENT QUERY ANALYSIS:
        User wants to know: {query}

        Now provide a comprehensive, technically accurate response:
        """

    return system_prompt.strip()


def chatbot_response(
    query: str, user_id: int, db: Session, top_k: int = 5, use_hyde: bool = True
) -> str:
    """
    Enhanced chatbot response using HyDE + Qdrant + LLM.
    Persists chat history in Postgres per user.
    """
    history = (
        db.query(ChatContext)
        .filter(ChatContext.user_id == user_id)
        .order_by(ChatContext.id.asc())
        .all()
    )

    hypothetical_answer = None
    search_query = query

    if use_hyde:
        print("Generating HyDE hypothetical answer...")
        hypothetical_answer = generate_hypothetical_answer(query)
        search_query = hypothetical_answer

    hits = search_chunks(search_query, top_k=top_k)

    if not hits:
        answer = "I could not find relevant information about this topic in the MOSDAC database. The query may be outside the current dataset coverage or use different terminology than our documentation."
        db.add(ChatContext(user_id=user_id, role="user", content=query))
        db.add(ChatContext(user_id=user_id, role="assistant", content=answer))
        db.commit()
        return answer

    prompt = build_enhanced_prompt(query, hits, history, hypothetical_answer)

    try:
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": query},
            ],
            temperature=0.1,
            max_tokens=1000,
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        return f"I encountered a technical issue while processing your query: {str(e)}"

    db.add(ChatContext(user_id=user_id, role="user", content=query))
    db.add(ChatContext(user_id=user_id, role="assistant", content=answer))
    db.commit()

    return answer


def chatbot_response_with_fallback(
    query: str, user_id: int, db: Session, top_k: int = 5
) -> str:
    """
    Enhanced version with HyDE fallback - tries HyDE first, falls back to standard RAG if needed
    """
    try:
        return chatbot_response(query, user_id, db, top_k, use_hyde=True)
    except Exception as hyde_error:
        print(f"HyDE approach failed, falling back to standard RAG: {hyde_error}")
        return chatbot_response(query, user_id, db, top_k, use_hyde=False)
