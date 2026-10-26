def normalize_activity(value):
    if not value:
        return None

    # Normalize input to a single string
    if isinstance(value, list):
        value = " ".join(str(v) for v in value if v)

    value = value.lower()

    if any(word in value for word in ["run", "jog"]):
        return "running"

    if any(word in value for word in ["walk", "hike", "stroll"]):
        return "walk"

    if "outdoor" in value:
        return "outdoor"

    return None