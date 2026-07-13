from app.observability.contracts.base_event import BaseEvent
from opentelemetry import trace
from app.observability.tracing import tracer
import json

class RecommendationObserver:

    def observe(self, event: BaseEvent):
        print(
            f"trace_id: [{event['trace_id']}], "
            f"correlation_id: [{event['correlation_id']}], "
            f"Recommendation observer triggered"
        )

        with tracer.start_as_current_span(event["event_type"]) as span:
            span.set_attribute(
                "trace_id",
                event["trace_id"]
            )
            span.set_attribute(
                "correlation_id",
                event["correlation_id"]
            )
            span.set_attribute(
                "event_type",
                event["event_type"]
            )

            span.set_attribute(
                "payload.recommendation_count",
                len(event["payload"]["recommendations"])
            )

            span.set_attribute(
                "payload.top_match",
                event["payload"]["recommendations"][0]["match"]
            )

            print(json.dumps(event, indent=2, default=str))
