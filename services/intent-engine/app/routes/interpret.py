from app.schemas import IntentRequest
from app.observability.observers.intent_observer import IntentObserver
from app.observability.context import RequestContext
from app.services.interpret import interpret_intent
from app.observability.contracts.intent_interpreted_event import build_interpret_event
from fastapi import APIRouter

router = APIRouter()

@router.post("/v1/intent/interpret")
def interpret(req: IntentRequest):
    intent_observer = IntentObserver()
    context = RequestContext.create()

    result = interpret_intent(req)

    event = build_interpret_event(
        context=context,
        request={
            "intent_text": req.intent.text,
            "signals": req.intent.signals
        },
        payload={
            "signals": result["signals"],
            "filters": result["filters"],
            "confidence": result["confidence"]
        }
    )

    intent_observer.observe(event)
    result['correlation_id'] = context.correlation_id
    return result