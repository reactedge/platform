from fastapi import APIRouter
from app.observability.observers.recommendation_observer import RecommendationObserver
from app.observability.context import RequestContext
from app.services.suggest import suggest_products
from app.schemas import RecommendationRequest
from app.observability.contracts.recommendation_generated_event import build_recommendations_event
from fastapi import Header

router = APIRouter()

@router.post("/v1/intent/suggest")
def suggest(
	req: RecommendationRequest,
	store: str = Header(default="default"),
	correlation_id: str = Header(alias="X-Correlation-Id")
):
    recommendation_observer = RecommendationObserver()
    context = RequestContext.create()

    result = suggest_products(req, store)

    event = build_recommendations_event(
        context=context,
        request={
            "signals": req.intent.signals,
            "product_count": len(req.products)
        },
        payload={
            "recommendations": [
                {
                    "sku": suggestion.sku,
                    "match": suggestion.match
                }
                for suggestion in result.suggestions
            ]
        }
    )

    recommendation_observer.observe(event)
    return result