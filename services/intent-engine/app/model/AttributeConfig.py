class AttributeConfig:
    def __init__(self, data: dict):
        self.dimensions = data.get("dimensions", {})
        self.synonyms = data.get("synonyms", {})
        self.signals = data.get("signals", {})

