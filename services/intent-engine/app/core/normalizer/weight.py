def normalize_weight(value: str):
    if not value:
        return None

    value = value.lower()

    if any(word in value for word in ["light", "breathable"]):
        return "light"

    if any(word in value for word in ["heavy", "insulated"]):
        return "heavy"

    return None