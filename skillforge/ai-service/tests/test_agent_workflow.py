import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.agent.graph import app_graph
from app.agent.tools import search_knowledge_base, calculate_gap

client = TestClient(app)

def test_graph_initialization():
    """Verify LangGraph compiles and contains required nodes"""
    nodes = app_graph.nodes
    assert "agent" in nodes
    assert "tools" in nodes

def test_tools_execution():
    """Test tools individually"""
    search_result = search_knowledge_base.invoke({"query": "FastAPI"})
    assert isinstance(search_result, str)
    
    gap_result = calculate_gap.invoke({"student_id": "00000000-0000-0000-0000-000000000000", "target_role": "Backend Engineer"})
    assert isinstance(gap_result, str)
    assert "No profile found" in gap_result or "{" in gap_result

def test_agent_endpoint_response():
    """Send POST to /internal/agent/chat and assert response"""
    payload = {
        "student_id": "00000000-0000-0000-0000-000000000000",
        "message": "Hello, I want to learn more.",
        "target_role": "Backend Engineer",
        "conversation_history": []
    }
    
    response = client.post("/internal/agent/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "response" in data
    assert isinstance(data["response"], str)
    assert len(data["response"]) > 0
