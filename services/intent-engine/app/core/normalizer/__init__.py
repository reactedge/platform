from app.core.normalizer.activity import normalize_activity
from app.core.normalizer.climate import normalize_climate
from app.core.normalizer.weight import normalize_weight
from app.core.normalizer.product_type import normalize_product_type

def normalize(raw: dict) -> dict:
    signals = {
       "location": raw.get("environment"),
       "weather": raw.get("weather"),
       "feature": raw.get("feature"),
       "temperature": raw.get("temperature"),
       "activity": normalize_activity(raw.get("use_case")),
       "weight": normalize_weight(raw.get("weight")),
       "product_type": normalize_product_type(raw.get("product_type")),
    }

    # remove empty signals
    return {k: v for k, v in signals.items() if v is not None}