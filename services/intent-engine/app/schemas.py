from pydantic import BaseModel
from typing import Optional, Dict, List, Any

class IntentInput(BaseModel):
    text: str
    signals: Optional[Dict[str, Any]] = {}


class AttributeOption(BaseModel):
    label: str
    value: str


class Attribute(BaseModel):
    code: str
    options: List[AttributeOption]


class IntentRequest(BaseModel):
    intent: IntentInput
    attributes: List[Attribute]
    context: Optional[Dict[str, Any]] = None

class IntentModel(BaseModel):
    signals: Dict[str, Dict[str, float]]  # attribute → value → score

class ProductModel(BaseModel):
    sku: str
    title: str
    shortDescription: Optional[str] = None
    attributes: Dict[str, List[str]]  # option IDs


class RecommendationRequest(BaseModel):
    intent: IntentModel
    products: List[ProductModel]


class RecommendationItem(BaseModel):
    sku: str
    match: float
    reason: Optional[str] = None


class RecommendationResponse(BaseModel):
    suggestions: List[RecommendationItem]

SuggestionSchema = {
    "name": "suggestions",
    "schema": {
        "type": "object",
        "properties": {
            "suggestions": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "index": {"type": "integer"},
                        "reason": {"type": "string"}
                    },
                    "required": ["index"]
                }
            }
        },
        "required": ["suggestions"]
    }
}