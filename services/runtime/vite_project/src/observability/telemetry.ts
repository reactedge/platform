import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {trace, type Tracer} from "@opentelemetry/api";

let tracer: Tracer;

export function setupTelemetry() {
    const endpoint = import.meta.env.VITE_OTEL_ENDPOINT;

    const exporter = new OTLPTraceExporter({
        url: `${endpoint}/v1/traces`
    });

    const provider = new WebTracerProvider({
        resource: resourceFromAttributes({
            'service.name': 'reactedge-runtime',
            'service.version': '1.0.0'
        }),
        spanProcessors: [
            new BatchSpanProcessor(exporter)
        ]
    });

    provider.register();

    tracer = trace.getTracer('reactedge-runtime');
}

export function getTracer() {
    return tracer;
}