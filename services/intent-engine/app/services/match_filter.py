def match_filters(keywords, attr_index):
    filters = []

    for code, options in attr_index.items():
        for label, value in options.items():
            for word in keywords:
                if word in label:
                    filters.append({
                        "attribute": code,
                        "value": value,
                        "label": label
                    })

    return filters

def index_attributes(attributes):
    index = {}

    for attr in attributes:
        code = attr.code
        index[code] = {}

        for option in attr.options:
            label = option.label.lower()
            index[code][label] = value = option.value

    return index