from typing import TypedDict
from app.observability.context import RequestContext
from app.observability.contracts.base_event import build_base_event


class Filter(TypedDict):
    attribute: str
    value: str
    label: str


class IntentInterpretRequest(TypedDict):
    intent_text: str
    signals: dict


class IntentInterpretPayload(TypedDict):
    signals: dict
    filters: list[Filter]
    confidence: float


def build_interpret_event(
    context: RequestContext,
    request: IntentInterpretRequest,
    payload: IntentInterpretPayload
):
    return build_base_event(
        event_type="intent_interpreted",
        trace_id=context.request_trace_id,
        correlation_id=context.correlation_id,
        source={
            "service": "intent-engine",
            "component": "intent-observer"
        },
        request={
            "intent_text": request["intent_text"],
            "signals": request["signals"]
        },
        payload={
            "signals": payload["signals"],
            "filters": payload["filters"],
            "confidence": payload["confidence"]
        }
    )