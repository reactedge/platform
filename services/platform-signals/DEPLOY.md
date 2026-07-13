## Install Python docker service

```bash
rsync -av \
--exclude venv \
--exclude .git \
--exclude __pycache__ \
--exclude .pytest_cache \
--exclude .idea \
--exclude .vscode \
--exclude .env \
platform-signals/ \
root@134.209.16.127:/var/www/platform-signals/
```

## Launch Python docker service
Local environment in dev mode
```bash
cd platform-signals
docker build \
  -t platform-signals \
  -f docker/Dockerfile \
  .
docker run -p 8000:8000 -v $(pwd):/app platform-signals