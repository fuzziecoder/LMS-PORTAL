"""
GCLMS API — Health Check Tests

Verifies the health check endpoint responds correctly.
"""

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check_returns_200():
    """Health check endpoint must return 200 with status healthy."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["status"] == "healthy"
    assert data["data"]["service"] == "gclms-api"


def test_health_check_has_request_id():
    """Health check response must include request_id in meta."""
    response = client.get("/api/v1/health")
    data = response.json()
    assert "request_id" in data["meta"]
