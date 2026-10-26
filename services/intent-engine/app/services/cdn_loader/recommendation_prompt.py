import requests
import json
from app.config import settings
from pathlib import Path

def load_recommendation_prompt():
    if not settings.recommendation_prompt_url:
        prompt_path = Path(settings.cdn_directory) / "recommendation" / "prompt.v1.json"
        try:
            with prompt_path.open(encoding="utf-8") as prompt_file:
                return json.load(prompt_file)
        except (OSError, json.JSONDecodeError):
            return None

    try:
        response = requests.get(settings.recommendation_prompt_url, timeout=2)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"[WARN] Failed to load prompt from CDN: {e}")
        return None