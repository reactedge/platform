import re
from app.services.match_filter import index_attributes

STOPWORDS = {
    "something", "for", "when", "it", "s", "a", "bit"
}

DETERMINISTIC_ATTRIBUTE = {
    "color",
    "size",
    "style_general"
}

VALID_SIZES = {"XS", "S", "M", "L", "XL"}

def extract_size(tokens):
    VALID_SIZES = {"XS", "S", "M", "L", "XL"}

    for i, token in enumerate(tokens):
        t = token.upper()

        if t in VALID_SIZES:
            # check context
            if (
                len(tokens) <= 3  # short query → likely intentional
                or "size" in tokens  # explicit context
                or (i > 0 and tokens[i-1] == "size")
            ):
                return t

    return None

def filter_tokens(tokens):
    cleaned = []
    detected = {}

    for i, t in enumerate(tokens):
        if t in STOPWORDS:
            continue

        # detect size inline
        if t.upper() in {"XS", "S", "M", "L", "XL"}:
            if i > 0 and tokens[i-1] == "size":
                detected["size"] = t.upper()
                continue

        cleaned.append(t)

    return cleaned

def tokenize(text: str):
    tokens = re.findall(r"\w+", text.lower())

    return filter_tokens(tokens)

def levenshtein(a: str, b: str) -> int:
    if a == b:
        return 0
    if len(a) < len(b):
        return levenshtein(b, a)

    previous_row = list(range(len(b) + 1))
    for i, ca in enumerate(a):
        current_row = [i + 1]
        for j, cb in enumerate(b):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (ca != cb)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]


def match_attribute_values(intent: str, attributes: dict):
    attr_index = index_attributes(attributes)
    tokens = tokenize(intent)
    matches = {}

    print(f"  + [Deterministic Tokens] {tokens}")

    for attr_code in DETERMINISTIC_ATTRIBUTE:
            options = attr_index.get(attr_code, {})

            for label, value_id in options.items():
                label_lower = label.lower()

                for token in tokens:
                    if token == label_lower:

                        if attr_code not in matches:
                            matches[attr_code] = []

                        matches[attr_code].append({
                            "attribute": attr_code,
                            "value": value_id,
                            "label": label
                        })

    return [item for values in matches.values() for item in values]