from pydantic_settings import BaseSettings
from typing import Optional, List
from pathlib import Path
import json

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    frontend_url: str
    env: str = "dev"
    openai_api_key: Optional[str] = None
    intent_prompt_url: Optional[str] = None
    recommendation_prompt_url: Optional[str] = None
    attribute_setting_url: Optional[str] = None
    openai_performance: Optional[float] = None
    openai_model: Optional[str] = None
    cdn_folder: Optional[str] = None
    cdn_directory: str = str(BASE_DIR / "cdn")

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