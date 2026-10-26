from app.model.AttributeConfig import AttributeConfig
from app.services.match_filter import index_attributes
from app.services.filter_extractor import build_filters
from app.services.signal_extractor import payload_signals_to_filters

class FilterBuilder:
    def __init__(self, config: AttributeConfig):
        self.config = config
        self.resolver = AttributeResolver(config)

    def build(self, signals, deterministic_filters, attributes, payload_signals):
        attr_index = index_attributes(attributes)

        filters = deterministic_filters
        filters += self._from_signals(signals, attr_index)
        filters += self._from_dimensions(signals, attr_index)
        #filters += build_filters(signals, attributes)
        if payload_signals:
            filters += payload_signals_to_filters(payload_signals, attr_index)

        #return filters

        return self._dedupe(filters)

    def _from_signals(self, signals, attr_index):
        filters = []

        for signal in signals:
            if isinstance(signal, dict):
                continue

            mapping = self.config.signals.get(signal)
            if not mapping:
                continue

            attr_code = mapping["attribute"]
            options = attr_index.get(attr_code, {})

            for label in mapping["labels"]:
                result = self.resolver.resolve(attr_code, label, options)
                if result:
                    filters.append({
                        "attribute": attr_code,
                        "value": result[1],
                        "label": result[0]
                    })

        return filters

    def _from_dimensions(self, signals, attr_index):
        filters = []

        for s in signals:
            if not isinstance(s, dict):
                continue

            dim = s.get("type")
            value = s.get("value")

            attr_code = self.config.dimensions.get(dim, dim)
            options = attr_index.get(attr_code, {})

            result = self.resolver.resolve(attr_code, value, options)
            if result:
                filters.append({
                    "attribute": attr_code,
                    "value": result[1],
                    "label": result[0]
                })

        return filters

    def _dedupe(self, filters):
       seen = set()
       result = []

       for f in filters:
          key = (f["attribute"], f["value"])
          if key not in seen:
              seen.add(key)
              result.append(f)

       return result

class AttributeResolver:
    def __init__(self, config: AttributeConfig):
        self.config = config

    def resolve(self, attr_code, value, options):
        value = value.lower()
        candidates = self.config.synonyms.get(attr_code, {}).get(value, [value])

        best = None
        best_score = 0

        for opt_label, opt_value in options.items():
            score = self._score(opt_label, candidates)

            if score > best_score:
                best_score = score
                best = (opt_label, opt_value)

        if best and best_score > 0:
            return best

        return None

    def _score(self, opt_label, candidates):
        opt_label = opt_label.lower()
        score = 0

        for c in candidates:
            if c == opt_label:
                score += 3
            elif c in opt_label:
                score += 2
            elif opt_label in c:
                score += 1

        return score