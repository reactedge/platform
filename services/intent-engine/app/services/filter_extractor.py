from app.services.match_filter import index_attributes

CATALOG_SYNONYMS = {
    "weight": {
        "light": ["light", "lightweight", "ultra light"],
        "medium": ["midweight", "medium"],
        "heavy": ["heavy", "heavyweight"]
    },
    "material": {
        "fleece": ["fleece", "polar fleece"],
        "down": ["down", "feather"],
        "synthetic": ["synthetic", "polyester"],
        "wool": ["wool", "merino"]
    }
}

CATALOG_CAPABILITY_MAP = {
    "material": {
        "fleece": ["warm"],
        "wool": ["warm", "breathable"],
        "cotton": ["breathable"],
        "polyester": [],
        "nylon": []
    },
    "fabric_tech": {
        "cocona® performance fabric": ["breathable"],
        "evercool™": ["breathable"],
        "cooltech™": ["breathable"],
        "lumatech™": [],
        "heattec®": ["warm"]
    }
}

BREATHABLE_LABELS = [
    "cotton",
    "wool",
    "cocona",
    "evercool",
    "cooltech"
]

DIMENSION_TO_ATTRIBUTE = {
    "product_type": "style_general",
    "weight": "weight",
    "material": "material"
}

SIGNAL_MAP = {
    "need_warmth": {
        "attribute": "climate",
        "labels": ["cold", "wintry"]
    },
    "need_waterproof": {
        "attribute": "climate",
        "labels": ["rainy"]
    },
    "need_windproof": {
        "attribute": "climate",
        "labels": ["windy"]
    },
}

def is_breathable(opt_label):
    label = opt_label.lower()
    return any(k in label for k in BREATHABLE_LABELS)

def signals_to_filters(signals, attr_index):
    filters = []

    for signal in signals:
        if isinstance(signal, dict):
            continue

        if signal == "need_breathable":
            filters += resolve_breathable(attr_index)
            continue

        mapping = SIGNAL_MAP.get(signal)
        if not mapping:
            continue

        attr_code = mapping["attribute"]
        labels = mapping["labels"]

        options = attr_index.get(attr_code, {})

        for label in labels:
            value = resolve_value(attr_code, label, options)
            if value:
                filters.append({
                    "attribute": attr_code,
                    "value": value,
                    "label": label
                })

    return dedupe_filters(filters)

def dimensions_to_filters(signals, attr_index):
    filters = []

    for s in signals:
        if not isinstance(s, dict):
            continue

        dim = s.get("type")
        value = s.get("value")

        if not dim or not value:
            continue

        attr_code = DIMENSION_TO_ATTRIBUTE.get(dim, dim)
        options = attr_index.get(attr_code, {})

        best = None
        best_score = 0

        for opt_label, opt_value in options.items():
            score = score_match(opt_label, CATALOG_SYNONYMS.get(attr_code, {}).get(value, [value]))

            if score > best_score:
                best_score = score
                best = (opt_label, opt_value)

        if best and best_score > 0:
            filters.append({
                "attribute": attr_code,
                "value": best[1],
                "label": best[0]
            })

    return filters

def build_filters(signals, attributes):
    attr_index = index_attributes(attributes)

    filters = []
    filters += signals_to_filters(signals, attr_index)
    filters += dimensions_to_filters(signals, attr_index)

    return dedupe_filters(filters)

def dedupe_filters(filters):
    seen = set()
    result = []

    for f in filters:
        key = (f["attribute"], f["value"])
        if key not in seen:
            seen.add(key)
            result.append(f)

    return result

def resolve_breathable(attr_index):
    filters = []

    for attr_code, options in attr_index.items():
        for opt_label, opt_value in options.items():
            if is_breathable_label(opt_label):
                filters.append({
                    "attribute": attr_code,
                    "value": opt_value,
                    "label": opt_label
                })

    return filters

def is_breathable_label(label: str) -> bool:
    label = label.lower()

    BREATHABLE_HINTS = [
        "cotton",
        "wool",
        "cocona",
        "evercool",
        "cooltech"
    ]

    return any(h in label for h in BREATHABLE_HINTS)

def find_option_value(options, label):
    label = label.lower()

    for opt_label, opt_value in options.items():
        if label in opt_label or opt_label in label:
            return opt_value

    return None

def score_match(opt_label, candidates):
    opt_label = opt_label.lower()
    score = 0

    for c in candidates:
        if c == opt_label:
            score += 3  # exact match
        elif c in opt_label:
            score += 2  # strong partial
        elif opt_label in c:
            score += 1  # weak partial

    return score

def resolve_value(attr_code, value, options):
    value = value.lower()
    candidates = CATALOG_SYNONYMS.get(attr_code, {}).get(value, [value])

    best = None
    best_score = 0

    for opt_label, opt_value in options.items():
        score = score_match(opt_label, candidates)

        if score > best_score:
            best_score = score
            best = (opt_label, opt_value)

    if best and best_score > 0:
        return best[1]

    return None