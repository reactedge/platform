```bash
rsync -av \
--exclude venv \
--exclude .git \
--exclude __pycache__ \
--exclude .pytest_cache \
--exclude .idea \
--exclude .vscode \
platform-signals/ \
root@134.209.16.127:/var/www/intent-engine/
```