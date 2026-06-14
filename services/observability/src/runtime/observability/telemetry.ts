import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {trace, type Tracer} from "@opentelemetry/api";

let tracer: Tracer;

export const SEVICE_NAME = 'widget-runtime'

export function setupTelemetry() {
    const endpoint = import.meta.env.VITE_OTEL_ENDPOINT ?? 'http://localhost:4318';

    const exporter = new OTLPTraceExporter({
        url: `${endpoint}/v1/traces`
    });

    const provider = new WebTracerProvider({
        resource: resourceFromAttributes({
            'service.name': SEVICE_NAME,
            'service.version': '1.0.0'
        }),
        spanProcessors: [
            new BatchSpanProcessor(exporter)
        ]
    });

    provider.register();

    tracer = trace.getTracer(SEVICE_NAME);

    const span = tracer.startSpan(
        'runtime.bootstrap'
    );

    span.end();

    console.log(
        '[OTEL] bootstrap span created'
    );
}

export function getTracer() {
    return tracer;
}