from fastapi.testclient import TestClient
from app.main import app


def test_quote_recommendation_accepts_empty_filters_and_returns_relevant_skus():
    client = TestClient(app)
    response = client.post(
        "/v1/intent/recommend",
        json={
            "intentText": "Trail shell",
            "filters": {},
            "products": [
                {"sku": "WJ12", "title": "Everyday Jacket", "attributes": {}},
                {"sku": "SH23", "title": "Trail Shell", "attributes": {}},
            ],
        },
    )

    assert response.status_code == 200
    assert response.json()["suggestions"][0]["sku"] == "SH23"