from app.services.cdn_loader.interpretation_prompt import load_interpretation_prompt
from app.services.cache import call_model_with_cache
from app.model.IntentEngine import IntentEngine
from app.services.cdn_loader.attribute_setting import load_attribute_setting
from app.model.AttributeConfig import AttributeConfig

def interpret_intent(req, prompt_override=None):

    prompt = prompt_override or load_interpretation_prompt()
    intent_text = req.intent.text
    attributes = req.attributes
    payload_signals = req.intent.signals

    if not prompt:
        return {
            "signals": {},
            "confidence": 0.0
        }

    try:
        raw = call_model_with_cache(prompt, intent_text)
    except Exception:
        print("[ERR] Failed to call openAI model:")
        raw = {}

    config_data = load_attribute_setting()
    attribute_config = AttributeConfig(config_data)

    engine = IntentEngine(attribute_config)
    result = engine.process(intent_text, attributes, raw, payload_signals)

    return result