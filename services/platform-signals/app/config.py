from pydantic_settings import BaseSettings
from typing import Optional, List
from pathlib import Path
import json

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    env: str = "dev"
    frontend_url: str = "http://localhost:3000"
    status_prefix: str = "/status"

    redis_host: str = "127.0.0.1"
    redis_port: int = 6379

    varnish_host: str = "127.0.0.1"
    varnish_port: int = 6081

    def allowed_origins(self) -> List[str]:
        return [origin.strip() for origin in self.frontend_url.split(",")]

    class Config:
        env_file = ".env"

settings = Settings()

def output_config():
    config = settings.model_dump()  # or .dict() if v1
    config.pop("openai_api_key", None)
    print(
        f"  + [BOOT] Loaded configuration: {json.dumps(config, indent=2)}",
        flush=True
    )