def as_list(v):
    if not v:
        return []
    return v if isinstance(v, list) else [v]

DETERMINISTIC_ATTRIBUTES = [
    "product_type",
    "weight",
    "material",
    "color",
    "size"
]

def extract_deterministic_signals(intent):
    signals = []

    for attr in DETERMINISTIC_ATTRIBUTES:
        value = intent.get(attr)

        if not value:
            continue

        # handle list vs single
        values = value if isinstance(value, list) else [value]

        for v in values:
            signals.append({
                "type": attr,
                "value": v
            })

    return signals

def extract_signals(intent):
    signals = []

    weather = as_list(intent.get("weather"))
    activity = as_list(intent.get("activity"))
    feature = as_list(intent.get("feature"))

    if "breathable" in feature:
        signals.append("need_breathable")

    if "rainy" in weather:
        signals.append("need_waterproof")

    if "windy" in weather:
        signals.append("need_windproof")

    if "cold" in weather:
        signals.append("need_warmth")

    if "outdoor" in activity:
        signals.append("outdoor_usage")

    signals += extract_deterministic_signals(intent)

    return signals

def payload_signals_to_filters(payload_signals, attr_index):
    filters = []

    for attr, values in payload_signals.items():
        options = attr_index.get(attr, {})

        for label in values:
            label_lower = label.lower()

            if label_lower not in options:
                continue

            filters.append({
                "attribute": attr,
                "value": options[label_lower],
                "label": label_lower
            })

    return filters
