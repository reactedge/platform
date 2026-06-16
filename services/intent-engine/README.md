## Install
```bash
mkdir intent-service
cd intent-service
mkdir app
touch app/main.py
sudo python3 -m venv venv
sudo apt install python3.8-venv
sudo python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn
pip install python-dotenv
pip install requests
pip install pytest
sudo pip install fastapi uvicorn
sudo apt install python-is-python3
python --version
cd venv/bin/
cd intent-service
uvicorn app.main:app --reload
```

then open http://127.0.0.1:8000/docs

## Run Intent Service API
```bash
curl -X GET http://127.0.0.1:8000/api/health
curl -X POST http://127.0.0.1:8000/api/intent/interpret   -H "Content-Type: application/json"   -d '{"intent":"light jacket for cold runs"}'
```

## Launch Python docker service
Local environment in dev mode
```bash
cd intent-engine
docker build \
  -t intent-service \
  -f docker/Dockerfile \
  .
docker run -p 3003:8000 -v $(pwd):/app intent-service

docker run \
  --network observability \
  -p 3003:8000 \
  -v $(pwd):/app \
  intent-service
docker run -d \
  --network observability \
  --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest
docker network create observability
```

```bash
caddy trust
cp /var/lib/caddy/.local/share/caddy/pki/authorities/local/root.crt /home/herve/ReactEdge/services/intent-engine/certs/caddy-root-crt
cp caddy-root.crt /usr/local/share/ca-certificates/
update-ca-certificates
```

## Go live
```bash
docker stop intent-service
docker rm intent-service
docker compose up -d --build --force-recreate intent-service
  docker logs intent-service
```

## Access the Jaeger servicez
```bash
http://localhost:16686
```

```bash
docker build -f docker/Dockerfile -t intent-service .
docker run -p 8000:8000 -v $(pwd):/app intent-service
```

## Test sentences
Light jacket for running in cold mornings
Something warm but not too heavy for outside
Lightweight jacket for hiking in cold windy weather
Waterproof jacket for hiking in heavy rain but still breathable
Warm insulated jacket for winter hiking but not too bulky
Something light and breathable for hot summer runs

```bash
docker run -it -v $(pwd):/app -w /app intent-service bash -c "pytest -s"
```

```bash
docker run -it \
-v $(pwd):/app -w /app intent-service bash -c "pytest tests/test_interpret.py::test_explicit_product_type -s"
```

## Empty Cache
```bash
sudo rm .cache/*
```

```bash
curl -X POST http://localhost:8000/v1/intent/interpret \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

```bash
curl -X POST http://localhost:8000/v1/intent/interpret \
    -H "Content-Type: application/json" \
    -d '{
        "intent": {
            "text": "Waterproof jacket for rainy and windy conditions",
            "signals": {}
        },
        "attributes": [
            {
                "code": "climate",
                "options": [
                    { "label": "Cold", "value": "202" },
                    { "label": "Wintry", "value": "210" },
                    { "label": "Windy", "value": "209" },
                    { "label": "Rainy", "value": "211" }
                ]
            },
            {
            "code": "style_general",
                "options": [
                    { "label": "Jacket", "value": "117" },
                    { "label": "Insulated", "value": "116" }
            ]
        }
    ]
}'
```

```bash
curl -X POST http://localhost:8000/v1/intent/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "intent": {
      "text": "I need a lightweight jacket for running in cold weather",
      "signals": {}
    },
    "attributes": [
      {
        "code": "climate",
        "options": [
          { "label": "Cold", "value": "202" },
          { "label": "Wintry", "value": "210" },
          { "label": "Windy", "value": "209" },
          { "label": "Rainy", "value": "211" }
        ]
      },
      {
        "code": "style_general",
        "options": [
          { "label": "Jacket", "value": "117" },
          { "label": "Insulated", "value": "116" }
        ]
      },
      {
        "code": "weight",
        "options": [
          { "label": "Lightweight", "value": "119" },
          { "label": "Midweight", "value": "120" },
          { "label": "Heavyweight", "value": "121" }
        ]
      },
      {
        "code": "material",
        "options": [
          { "label": "Fleece", "value": "144" },
          { "label": "Synthetic", "value": "150" },
          { "label": "Down", "value": "151" }
        ]
      }
    ]
  }'
```

```bash
curl -X POST http://localhost:8000/v1/intent/interpret \
  -H "Content-Type: application/json" \
  -d '{
    "intent": {
      "text": "I need a jacket for hiking on Mars",
      "signals": {}
    },
    "attributes": [
      {
        "code": "climate",
        "options": [
          { "label": "Cold", "value": "202" },
          { "label": "Wintry", "value": "210" },
          { "label": "Windy", "value": "209" },
          { "label": "Rainy", "value": "211" }
        ]
      },
      {
        "code": "style_general",
        "options": [
          { "label": "Jacket", "value": "117" },
          { "label": "Insulated", "value": "116" }
        ]
      },
      {
        "code": "weight",
        "options": [
          { "label": "Lightweight", "value": "119" },
          { "label": "Midweight", "value": "120" },
          { "label": "Heavyweight", "value": "121" }
        ]
      },
      {
        "code": "material",
        "options": [
          { "label": "Fleece", "value": "144" },
          { "label": "Synthetic", "value": "150" },
          { "label": "Down", "value": "151" },
          { "label": "EverCool™", "value": "401" },
          { "label": "CoolTech™", "value": "402" }
        ]
      }
    ]
  }'
```

### Recommendations
```bash
curl -X POST "http://localhost:8000/v1/intent/suggest" \
    -H "Content-Type: application/json" \
    -H "X-Store: en" \
    -H "X-Correlation-Id: 95cbd364-883c-4868-ad7a-dc8778f599cd" \
    -d '{
            "intent": {
                "signals": {
                "climate": {
                    "Cold": 1.0,
                    "Wintry": 1.0
                }
          }
        },
        "products": [
            {
                "sku": "MJ11",
                "title": "Typhon Performance Fleece-lined Jacket",
                "shortDescription": "Ironmen and couch warriors both reach for the Typhon Performance Fleece-lined Jacket.",
                "attributes": {
                    "climate": ["All-Weather", "Spring", "Windy"]
                }
            },
            {
                "sku": "MJ08",
                "title": "Lando Gym Jacket",
                "shortDescription": "The Lando Gym Jacket offers strategic ventilation at perspiration-prone areas, while moisture-wicking technology helps you stay dry.",
                "attributes": {
                    "climate": ["Cool", "Windy", "Mild"]
                }
            },
            {
                "sku": "MJ04",
                "title": "Kenobi Trail Jacket",
                "shortDescription": "Kenobi Trail Jacket – Aside from sealed seams to keep moisture out and body heat in, the Kenobi Trail Vest is all about media convenience.",
                "attributes": {
                    "climate": ["Cold", "Cool", "Spring", "Windy", "Wintry"]
                }
        }
    ]
}'
```

```bash
curl -X POST "http://localhost:8000/v1/intent/suggest" \
    -H "Content-Type: application/json" \
    -H "X-Store: en" \
    -d '{
        "intent": {
        "signals": {
        "climate": {
        "Cold": 1.0,
        "Wintry": 1.0,
        "Windy": 0.5
    }
    }
    },
    "products": [
        {
            "sku": "MJ11",
            "title": "Typhon Performance Jacket",
            "shortDescription": "Lightweight protection for changing weather.",
            "attributes": {
            "climate": ["All-Weather", "Spring", "Windy"]
        }
        },
        {
            "sku": "MJ08",
            "title": "Lando Gym Jacket",
            "shortDescription": "Breathable and flexible for training.",
            "attributes": {
            "climate": ["Cool", "Windy", "Mild"]
        }
        },
        {
            "sku": "MJ04",
            "title": "Kenobi Trail Jacket",
            "shortDescription": "Built for cold and harsh conditions.",
            "attributes": {
            "climate": ["Cold", "Cool", "Windy", "Wintry"]
        }
        },
        {
            "sku": "MJ07",
            "title": "Hoth Expedition Parka",
            "shortDescription": "Extreme protection for freezing climates.",
            "attributes": {
            "climate": ["Cold", "Wintry"]
        }
        }
    ]
}'
```


curl -X POST "https://openai-python.local/v1/intent/suggest" \
-H "Content-Type: application/json" \
-H "X-Store: en" \
-H "X-Correlation-Id:test" \
-d '{
"intent": {
"signals": {
"climate": {
"Cold": 1.0,
"Wintry": 1.0,
"Windy": 0.5
}
}
},
"products": [
{
"sku": "MJ11",
"title": "Typhon Performance Jacket",
"shortDescription": "Lightweight protection for changing weather.",
"attributes": {
"climate": ["All-Weather", "Spring", "Windy"]
}
},
{
"sku": "MJ08",
"title": "Lando Gym Jacket",
"shortDescription": "Breathable and flexible for training.",
"attributes": {
"climate": ["Cool", "Windy", "Mild"]
}
},
{
"sku": "MJ04",
"title": "Kenobi Trail Jacket",
"shortDescription": "Built for cold and harsh conditions.",
"attributes": {
"climate": ["Cold", "Cool", "Windy", "Wintry"]
}
},
{
"sku": "MJ07",
"title": "Hoth Expedition Parka",
"shortDescription": "Extreme protection for freezing climates.",
"attributes": {
"climate": ["Cold", "Wintry"]
}
}
]
}'