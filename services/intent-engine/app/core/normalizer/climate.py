def normalize_climate(value: str):
    if not value:
        return None

    value = value.lower()

    if any(word in value for word in ["cold", "chilly", "freezing"]):
        return "cold"

    if any(word in value for word in ["mild", "cool"]):
        return "mild"

    if any(word in value for word in ["hot", "warm"]):
        return "hot"

    return None