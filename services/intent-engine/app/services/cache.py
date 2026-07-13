import json
import hashlib
import os
from app.clients.openai_client import call_model

CACHE_DIR = ".cache"

def call_model_with_cache(prompt, intent: str) -> str | None:
    intent = (intent or "").strip()

    if not intent:
        print("⛔ skip openai: empty intent")
        return None

    key = get_cache_key(prompt, intent)

    cached = load_from_cache(key)
    if cached:
        print("⚡ cache hit")
        return cached

    print("🔥 call openai")
    raw = call_model(prompt, intent)
    save_to_cache(key, raw)

    return raw

def get_cache_key(prompt, intent: str) -> str:
    prompt_str = json.dumps(prompt, sort_keys=True)
    raw = prompt_str + intent
    return hashlib.md5(raw.encode()).hexdigest()


def load_from_cache(key: str):
    path = f"{CACHE_DIR}/{key}.json"
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return None


def save_to_cache(key: str, data):
    os.makedirs(CACHE_DIR, exist_ok=True)
    with open(f"{CACHE_DIR}/{key}.json", "w") as f:
        json.dump(data, f)