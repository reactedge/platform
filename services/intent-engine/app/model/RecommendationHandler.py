from typing import List, Optional
from pydantic import BaseModel
import json
from openai import OpenAI
from app.schemas import SuggestionSchema
from app.schemas import RecommendationResponse
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

class SuggestionItem(BaseModel):
    index: int
    reason: Optional[str] = None


class AiRecommendationResponse(BaseModel):
    suggestions: List[SuggestionItem] = []

class RecommendationHandler:

    def __init__(self, model: str, temperature: float):
        self.model = model
        self.temperature = temperature

    def get_suggestions(self, model_input: dict, prompt: str, store: str) -> RecommendationResponse:
        try:
            completion = client.chat.completions.create(
                model=self.model,
                temperature=self.temperature,
                response_format={
                    "type": "json_schema",
                    "json_schema": SuggestionSchema  # you define this
                },
                messages=[
                    {
                        "role": "system",
                        "content": f"{prompt} Respond in {'French' if store == 'fr' else 'English'}."
                    },
                    {
                        "role": "user",
                        "content": json.dumps(model_input)
                    }
                ]
            )

            content = completion.choices[0].message.content or "{}"
            raw = json.loads(content)
            suggestions = raw.get("suggestions", [])[:5]

            return {
                "suggestions": suggestions
            }

        except Exception as e:
            print("[ERROR parsing recommendations]", e)
            return {
                "suggestions": []
            }