from app.model.product import pre_score_products
from app.services.cdn_loader.recommendation_prompt import load_recommendation_prompt
from app.model.RecommendationHandler import RecommendationHandler
from app.config import settings
from app.schemas import RecommendationRequest
from app.schemas import RecommendationResponse
from app.schemas import QuoteRecommendationRequest
import re

def suggest_products(payload: RecommendationRequest, store: str):
    signals = payload.intent.signals if payload.intent else {}
    products = payload.products

    if not payload.products or not payload.intent or not signals:
        return {"suggestions": []}

    candidates = pre_score_products(payload.products, signals, 12)

    model_input = _signal_model_input(payload.intent.signals, candidates)
    prompt = load_recommendation_prompt()
    recommendation_handler = RecommendationHandler(settings.openai_model, settings.openai_performance)
    suggestions = recommendation_handler.get_suggestions(model_input, prompt, store)
    max_score = sum(
        weight for attr in signals.values() for weight in attr.values()
    )
    result = _map_signal_suggestions(suggestions["suggestions"], candidates, max_score)
    print(f"  => suggestions: {result}")

    return RecommendationResponse(suggestions=result)


def _signal_model_input(signals, candidates):
    return {
        "intent": signals,
        "products": [
            {
                "sku": product.sku,
                "title": product.title,
                "attributes": product.attributes,
                "shortDescription": (
                    product.shortDescription[:240]
                    if product.shortDescription else None
                ),
            }
            for product, _ in candidates
        ],
    }


def _map_signal_suggestions(suggestions, candidates, max_score):
    result = []
    for item in suggestions:
        index = item["index"]
        if not isinstance(index, int) or index < 0 or index >= len(candidates):
            continue
        product, score = candidates[index]

        percentage = round((score / max_score) * 100) if max_score > 0 else 0

        result.append({
            "sku": product.sku,
            "match": percentage,
            "reason": item["reason"]
        })

    return result


def recommend_quote_products(payload: QuoteRecommendationRequest, store: str):
    if not payload.products or not payload.intentText.strip():
        return RecommendationResponse(suggestions=[])

    prompt = load_recommendation_prompt()
    if isinstance(prompt, dict):
        prompt = "\n".join(prompt.get("instructions", []))
    if not prompt:
        prompt = (
            "Rank products for the user's intentText. Filters may be empty. "
            "Return up to five distinct relevant product indexes as JSON."
        )

    handler = RecommendationHandler(settings.openai_model, settings.openai_performance)
    response = handler.get_suggestions(_quote_model_input(payload), prompt, store)
    suggestions = _map_quote_suggestions(
        response.get("suggestions", []), payload
    )
    if not suggestions:
        suggestions = _rank_by_text(payload)

    return RecommendationResponse(suggestions=suggestions[:5])


def _quote_model_input(payload: QuoteRecommendationRequest):
    return {
        "intentText": payload.intentText,
        "filters": payload.filters,
        "products": [
            {
                "sku": product.sku,
                "title": product.title,
                "shortDescription": product.shortDescription,
            }
            for product in payload.products
        ],
    }


def _map_quote_suggestions(suggestions, payload: QuoteRecommendationRequest):
    valid = []
    seen = set()
    for suggestion in suggestions:
        index = suggestion.get("index", -1)
        if not isinstance(index, int) or index < 0 or index >= len(payload.products) or index in seen:
            continue
        seen.add(index)
        valid.append({
            "sku": payload.products[index].sku,
            "match": 0,
            "reason": suggestion.get("reason"),
        })
    return valid


def _rank_by_text(payload: QuoteRecommendationRequest):
    intent_terms = set(re.findall(r"[a-z0-9]+", payload.intentText.lower()))
    ranked = []
    for product in payload.products:
        title_terms = set(re.findall(r"[a-z0-9]+", product.title.lower()))
        description_terms = set(re.findall(
            r"[a-z0-9]+", (product.shortDescription or "").lower()
        ))
        score = len(intent_terms & title_terms) * 2 + len(intent_terms & description_terms)
        if score:
            ranked.append((score, product))

    ranked.sort(key=lambda item: item[0], reverse=True)
    max_score = ranked[0][0] if ranked else 0
    return [
        {
            "sku": product.sku,
            "match": round(score / max_score * 100),
            "reason": "Matches terms in the requested product intent.",
        }
        for score, product in ranked[:5]
    ]