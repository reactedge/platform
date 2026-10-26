from fastapi import APIRouter, Header
from app.schemas import QuoteRecommendationRequest
from app.services.suggest import recommend_quote_products

router = APIRouter()


@router.post("/v1/intent/recommend")
def recommend(
    req: QuoteRecommendationRequest,
    store: str = Header(default="default"),
):
    return recommend_quote_products(req, store)