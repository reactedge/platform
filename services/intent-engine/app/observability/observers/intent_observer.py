from app.observability.contracts.base_event import BaseEvent
from opentelemetry import trace
from app.observability.tracing import tracer
import json


class IntentObserver:

    def observe(self, event: BaseEvent):
        print(
            f"trace_id: [{event['trace_id']}], "
            f"correlation_id: [{event['correlation_id']}], "
            f"Intent observer triggered"
        )

        with tracer.start_as_current_span(event["event_type"]) as span:
            span.set_attribute(
                "trace_id",
                event["trace_id"]
            )

            span.set_attribute(
                "event_type",
                event["event_type"]
            )

            span.set_attribute(
                "request.intent_text",
                event["request"]["intent_text"]
            )

            span.set_attribute(
                "payload.filter_attributes",
                ",".join(
                    f["attribute"]
                    for f in event["payload"]["filters"]
                )
            )

            span.set_attribute(
                "payload.filter_labels",
                ",".join(
                    f["label"]
                    for f in event["payload"]["filters"]
                )
            )

            span.set_attribute(
                "payload.confidence",
                event["payload"]["confidence"]
            )

            print(json.dumps(event, indent=2, default=str))
