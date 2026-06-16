from opentelemetry import trace

from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from app.config import settings

from opentelemetry.exporter.otlp.proto.http.trace_exporter import (
    OTLPSpanExporter,
)

resource = Resource.create({
    "service.name": "intent-engine",
    "service.version": "1.0.0",
})

trace.set_tracer_provider(
    TracerProvider(resource=resource)
)

otlp_exporter = OTLPSpanExporter(
    endpoint=settings.otel_endpoint
)

span_processor = BatchSpanProcessor(
    otlp_exporter
)

trace.get_tracer_provider().add_span_processor(
    span_processor
)

tracer = trace.get_tracer(__name__)