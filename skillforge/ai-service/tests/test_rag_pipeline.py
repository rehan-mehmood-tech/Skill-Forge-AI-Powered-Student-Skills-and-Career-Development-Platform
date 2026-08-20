import os
import pytest
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
from app.rag.retriever import KnowledgeBaseRetriever

def test_kb_dataset_exists():
    # Verify dataset existence in skillforge/ai-service/data/knowledge_base/
    data_dir = Path(__file__).parent.parent / "data" / "knowledge_base"
    assert data_dir.exists(), "Knowledge base directory missing."
    md_files = list(data_dir.glob("*.md"))
    json_files = list(data_dir.glob("*.json"))
    assert len(md_files) > 0, "No markdown documents found in knowledge base."
    assert len(json_files) > 0, "No json benchmarks found in knowledge base."

def test_embed_query_dimensions():
    # Test KnowledgeBaseRetriever.embed_query() produces valid 768-dim float vectors
    retriever = KnowledgeBaseRetriever()
    vector = retriever.embed_query("How to structure FastAPI microservices?")
    
    assert isinstance(vector, list)
    assert len(vector) == 768
    assert all(isinstance(v, float) for v in vector)

def test_retrieve_relevant_chunks():
    # Test retrieve_relevant_chunks() with sample queries
    retriever = KnowledgeBaseRetriever()

    # With a real model, we should get matches > 0.40
    results_fastapi = retriever.retrieve_relevant_chunks("How to structure FastAPI microservices?", top_k=2)
    assert len(results_fastapi) > 0
    assert results_fastapi[0]['similarity_score'] >= 0.40
    assert results_fastapi[0]['title'] is not None
    assert results_fastapi[0]['content'] is not None

    results_langgraph = retriever.retrieve_relevant_chunks("LangGraph state orchestration", domain="ai")
    assert len(results_langgraph) > 0
    assert results_langgraph[0]['domain'] == "ai"
    assert results_langgraph[0]['similarity_score'] >= 0.40
