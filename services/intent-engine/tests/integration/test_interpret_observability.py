from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_interpret_generates_trace():

    response = client.post(
        "/v1/intent/interpret",
        json={
         "intent": {
           "text": "Warm insulated jacket for winter hiking but not too bulky",
           "signals": {}
         },
         "attributes": [
           {
             "code": "climate",
             "options": [
               { "label": "Cold", "value": "202" },
               { "label": "Wintry", "value": "210" },
               { "label": "Windy", "value": "209" }
             ]
           },
           {
             "code": "style_general",
             "options": [
               { "label": "Jacket", "value": "117" },
               { "label": "Insulated", "value": "116" },
               { "label": "Lightweight", "value": "119" }
             ]
           },
           {
             "code": "material",
             "options": [
               { "label": "Fleece", "value": "144" },
               { "label": "HeatTec", "value": "151" }
             ]
           }
         ]
       }
    )

    assert response.status_code == 200