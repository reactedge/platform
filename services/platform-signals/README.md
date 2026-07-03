# Platform Signals

Platform Signals exposes host-level operational signals through a lightweight REST API.

The service is intended to run alongside the platform it observes and provides read-only access to system signals. It does not assess platform health or perform remediation.

---

## Install

```bash
mkdir platform-signals
cd platform-signals

python3 -m venv venv
source venv/bin/activate

pip install fastapi uvicorn
pip install pydantic-settings
pip install python-dotenv
pip install redis
pip install psutil
pip install pytest
```

Start the service:

```bash
uvicorn app.main:app --reload
```

Open:

```
http://127.0.0.1:8000/docs
```

---

## Run Platform Signals API

```bash
curl http://127.0.0.1:8000/status
```

Current response:

```json
{
  "cpu": {
    "status": "ok"
  },
  "memory": {
    "status": "ok"
  },
  "disk": {
    "status": "ok"
  }
}
```

---

## Docker

Build:

```bash
docker build \
  -t platform-signals \
  -f docker/Dockerfile \
  .
```

Run:

```bash
docker run \
  -p 8000:8000 \
  -v $(pwd):/app \
  platform-signals
```

---

## Run Tests

```bash
pytest
```

or

```bash
docker run -it \
  -v $(pwd):/app \
  -w /app \
  platform-signals \
  pytest -s
```

---

## Roadmap

Initial platform signals:

- CPU usage
- Memory usage
- Disk usage

Future signals:

- Redis
- Varnish
- Docker
- Network
- Filesystem
- TLS certificates
- Kubernetes
- Process monitoring

---

## Architecture

```text
Linux / Docker / Redis / Varnish
               │
               ▼
      Platform Signals
               │
         REST API (/status)
               │
               ▼
        ReactEdge Health Engine
```

Platform Signals is responsible only for exposing platform signals.

The Health Engine consumes those signals to perform health assessment, diagnosis and remediation.