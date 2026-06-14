import pytest

from app.services.interpret import interpret_intent

class MockReq:
    def __init__(self, intent):
        self.intent = intent

TEST_PROMPT = {
        "instructions": [
          "Extract semantic signals from a user query.",
          "",
          "Return a JSON object with optional fields:",
          "- use_case (what the product is used for)",
          "- environment (conditions such as cold, hot, indoor, outdoor, warm)",
          "- weight (such as light, heavy)",
          "- product_type (such as jacket, trouser, top, shoe, coat)",
          "Interpret intent in terms of usage conditions, not product description.",
          "",
          "Examples:",
          "- warm jacket → environment = cold,",
          "- something breathable for summer → environment = hot,",
          "- light layer for spring → environment = mild,",
          "- something breathable → weight = light,",
          "",
          "Always return normalized values.",
          ",",
          "Rules:",
          "- Only return product_type if explicitly stated (e.g. \"jacket\", \"boots\").",
          "- Do NOT infer or guess product_type.",
          "- Do not invent values.",
          "- If a signal is unclear, omit it.",
          ",",
          "Allowed values:",
          "- environment: [cold, mild, hot]",
          "- use_case: [running, walking, outdoor, casual]",
          "-product_type: [jacket, coat, vest, t-shirt, shoes, boots",
          ",",
          "Do not assume any specific product catalog.",
          "Use simple, generic terms."
        ]
      }


def test_explicit_product_type():
    result = interpret_intent(MockReq("light jacket for running"), TEST_PROMPT)

    assert result["signals"]["product_type"] == "jacket"
    assert result["signals"]["activity"] == "running"


def test_no_product_inference():
    result = interpret_intent(MockReq("light breathable for summer runs"), TEST_PROMPT)

    assert "product_type" not in result["signals"]


def test_warm_means_cold():
    result = interpret_intent(MockReq("warm jacket"), TEST_PROMPT)

    assert result["signals"]["climate"] == "cold"


def test_breathable_maps_to_light():
    result = interpret_intent(MockReq("breathable top for summer"), TEST_PROMPT)

    assert result["signals"]["weight"] == "light"


def test_noise_is_ignored():
    result = interpret_intent(MockReq("jacket for running on mars"), TEST_PROMPT)

    assert result["signals"]["activity"] == "running"
    assert "mars" not in str(result["signals"]).lower()


def test_empty_intent():
    result = interpret_intent(MockReq("something nice"), TEST_PROMPT)

    assert result["signals"] == {}
    assert result["confidence"] == 0.0