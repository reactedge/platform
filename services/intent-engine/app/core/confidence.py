def compute_confidence(filters: dict, intent: str) -> float:
    if not filters:
        return 0.0

    score = 0.4

    # more attributes matched = higher confidence
    score += 0.1 * len(filters)

    # longer intent = usually clearer
    if len(intent.split()) > 5:
        score += 0.1

    return round(min(score, 1), 2)