from datetime import datetime
from typing import TypedDict, Any


class BaseEvent(TypedDict):
    event_type: str
    event_version: str
    timestamp: str
    correlation_id: str
    trace_id: str
    source: dict
    request: dict
    payload: dict


def build_base_event(
    event_type: str,
    trace_id: str,
    correlation_id: str,
    source: dict,
    request: dict,
    payload: dict
) -> BaseEvent:
    return {
        "event_type": event_type,
        "event_version": "1.0",
        "timestamp": datetime.utcnow().isoformat(),
        "correlation_id": correlation_id,
        "trace_id": trace_id,
        "source": source,
        "request": request,
        "payload": payload
    }