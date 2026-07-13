from app.model.product import pre_score_products
from app.services.cdn_loader.recommendation_prompt import load_recommendation_prompt
from app.model.RecommendationHandler import RecommendationHandler
from app.config import settings
from app.schemas import RecommendationRequest
from app.schemas import RecommendationResponse

def suggest_products(payload: RecommendationRequest, store: str):
    signals = payload.intent.signals if payload.intent else {}
    products = payload.products

    if not payload.products or not payload.intent or not signals:
        return {"suggestions": []}

    candidates = pre_score_products(payload.products, signals, 12)
    
    model_input = {
     "intent": payload.intent.signals,
     "products": [
      {
       "sku": p.sku,
       "title": p.title,
       "attributes": p.attributes,
       "shortDescription": (
        p.shortDescription[:240] if p.shortDescription else None
       )
      }
      for p, _ in candidates
     ]
    }
    
    prompt = load_recommendation_prompt()
    recommendation_handler = RecommendationHandler(settings.openai_model, settings.openai_performance)
    suggestions = recommendation_handler.get_suggestions(model_input, prompt, store)

    result = []
    max_score = sum(
        weight for attr in signals.values() for weight in attr.values()
    )

    for item in suggestions["suggestions"]:
        product, score = candidates[item["index"]]

        percentage = round((score / max_score) * 100) if max_score > 0 else 0

        result.append({
            "sku": product.sku,
            "match": percentage,
            "reason": item["reason"]
        })

    print(f"  => suggestions: {result}")

    return RecommendationResponse(suggestions=result)