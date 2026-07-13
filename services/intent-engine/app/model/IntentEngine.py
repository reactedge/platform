from app.core.normalizer import normalize
from app.services.signal_extractor import extract_signals
from app.services.deterministic_extractor import match_attribute_values
from app.core.confidence import compute_confidence
from app.model.FilterBuilder import FilterBuilder

class IntentEngine:
    def __init__(self, attribute_config):
        self.attribute_config = attribute_config
        self.filter_builder = FilterBuilder(attribute_config)

    def process(self, intent_text, attributes, raw, payload_signals):
        print(f"  + [Intent Text] {intent_text}")
        print(f"  + [Intent Processed] {raw}")
        if raw is not None:
            intent = normalize(raw)
            print(f"  + [Normalised Intent] {intent}")
            signals = extract_signals(intent)
            #signals = merge_signals(payload_signals, signals)
            print(f"  + [Signals] {signals}")
        else:
            signals = []
                  
        deterministic_filters = match_attribute_values(intent_text, attributes)
        print(f"  + [Deterministic Filters] {deterministic_filters}")
        filters = self.filter_builder.build(signals, deterministic_filters, attributes, payload_signals)
        print(f"  + [Filters] {filters}")
        confidence = compute_confidence(filters, intent_text)
        print(f"  + [Confidence] {confidence}")

        if confidence < 0.3 or not filters:
            return {
                "signals": [],
                "filters": [],
                "confidence": confidence
            }

        return {
            "signals": signals,
            "filters": filters,
            "confidence": confidence
        }