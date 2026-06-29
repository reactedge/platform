import {context, Span, SpanStatusCode, trace, Tracer} from "@opentelemetry/api";
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-http";
import {NodeTracerProvider} from "@opentelemetry/sdk-trace-node";
import {resourceFromAttributes} from "@opentelemetry/resources";
import {BatchSpanProcessor} from "@opentelemetry/sdk-trace-base";

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
        name: string,
        traceId: string,
        parentSpanId: string
    ): Span {
        const parentContext =
            trace.setSpanContext(
                context.active(),
                {
                    traceId,
                    spanId: parentSpanId,
                    traceFlags: 1
                }
            );

        this.span =
            this.tracer.startSpan(
                name,
                undefined,
                parentContext
            );

        return this.span
    }

    startRemoteOperation(
        name: string,
        traceId: string,
        parentSpanId: string
    ): Span {
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
                name,
                undefined,
                parentContext
            );

        this.addEvent('ssr_reconciled',{
            remote_parent: true
        });

        return this.span
    }

    endOperation() {
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
        payload?: Record<string, any>
    ) {
        this.span.addEvent(
            name,
            payload
        );
    }
}