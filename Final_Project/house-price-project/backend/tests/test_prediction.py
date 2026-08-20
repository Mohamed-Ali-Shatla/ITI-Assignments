import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture()
def client():
    # Using a context manager triggers FastAPI's lifespan (startup/shutdown) events,
    # which is what actually loads the model — exactly like a real running server.
    with TestClient(app) as c:
        yield c


def test_health_ok(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_happy_path(client):
    payload = {
        "location": "thane",
        "carpet_area_sqft": 650,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert "predicted_price" in body
    assert isinstance(body["predicted_price"], (int, float))
    assert body["predicted_price"] > 0


def test_predict_invalid_input_returns_422(client):
    # Missing required fields and a negative area -> should fail validation
    payload = {
        "location": "thane",
        "carpet_area_sqft": -50,  # invalid: must be > 0
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        # missing furnishing / transaction / ownership / facing
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
