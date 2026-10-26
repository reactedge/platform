from typing import TypedDict
from app.observability.context import RequestContext
from app.observability.contracts.base_event import build_base_event

class Recommendation(TypedDict):
    sku: str
    score: float


class RecommendationRequest(TypedDict):
    signals: dict
    product_count: int


class RecommendationPayload(TypedDict):
    recommendations: list[Recommendation]


def build_recommendations_event(
    context: RequestContext,
    request: RecommendationRequest,
    payload: RecommendationPayload
):
    return build_base_event(
        event_type="recommendation_generated",
        trace_id=context.request_trace_id,
        correlation_id=context.correlation_id,
        source={
            "service": "intent-engine",
            "component": "recommendation-observer"
        },
        request={
            "signals": request["signals"],
            "product_count": request["product_count"]
        },
        payload={
            "recommendations": payload["recommendations"]
        }
    )