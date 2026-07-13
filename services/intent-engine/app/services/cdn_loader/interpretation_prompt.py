import requests
from app.config import settings

def load_interpretation_prompt():
    try:
        response = requests.get(settings.intent_prompt_url, timeout=2)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"[WARN] Failed to load prompt from CDN: {e}")
        return None