import {context, Span, SpanStatusCode, trace, Tracer} from "@opentelemetry/api";
import {getTracer, setupTelemetry} from "./tracing";
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-http";
import {NodeTracerProvider} from "@opentelemetry/sdk-trace-node";
import {resourceFromAttributes} from "@opentelemetry/resources";
import {BatchSpanProcessor} from "@opentelemetry/sdk-trace-base";
import {logger} from "../logger";

export function getActiveSpan(traceId: string, parentSpanId: string) {
    const parentContext =
        trace.setSpanContext(
            context.active(),
            {
                traceId,
                spanId: parentSpanId,
                traceFlags: 1,
                isRemote: true
            }
        );

    const span =
        getTracer().startSpan(
            'ssr.render',
            undefined,
            parentContext
        );

    return span
}

export class OpenTelemetryObserver {
    private serviceName = 'reactedge-ssr';

    private span: Span

    private tracer: Tracer

    constructor() {
        const exporter = new OTLPTraceExporter({
            url: process.env.OTEL_HOST
        });

        const provider = new NodeTracerProvider({
            resource: resourceFromAttributes({
                'service.name': this.serviceName,
                'service.version': '1.0.0'
            }),
            spanProcessors: [
                new BatchSpanProcessor(exporter)
            ]
        });

        provider.register();

        this.tracer = trace.getTracer(this.serviceName);
    }

    startOperation(
        traceId: string,
        parentSpanId: string
    ): void {
        const parentContext =
            trace.setSpanContext(
                context.active(),
                {
                    traceId,
                    spanId: parentSpanId,
                    traceFlags: 1,
                    isRemote: true
                }
            );

        this.span =
            this.tracer.startSpan(
                'ssr.render',
                undefined,
                parentContext
            );

        this.addEvent('ssr_reconciled',{
            remote_parent: true
        });
    }

    endOperation(resultLength: number) {
        this.addEvent('api_reponse',{
            'ssr.html.length': resultLength
        });

        this.span.end();
    }

    failOperation(error: unknown)
    {
        this.span.recordException(
            error as Error
        );

        this.span.setStatus({
            code: SpanStatusCode.ERROR,
            message: String(error)
        });

        this.span.end();
    }

    addEvent(
        name: string,
        payload: Record<string, any>
    ) {
        this.span.addEvent(
            name,
            payload
        );
    }
}