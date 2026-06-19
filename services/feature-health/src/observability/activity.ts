import {context, Span, SpanStatusCode, trace, Tracer} from "@opentelemetry/api";
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-http";
import {NodeTracerProvider} from "@opentelemetry/sdk-trace-node";
import {resourceFromAttributes} from "@opentelemetry/resources";
import {BatchSpanProcessor} from "@opentelemetry/sdk-trace-base";

export class OpenTelemetryObserver {
    private serviceName = 'reactedge-health';

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

        const tracer = this.tracer


        // 1. Dummy parent span
        const parentSpan =
            tracer.startSpan(
                'dummy.operation'
            );

        // 2. Event on parent span
        parentSpan.addEvent(
            'parent.started',
            {
                status: 'ok'
            }
        );

        // 3. Child span
        const childSpan =
            tracer.startSpan(
                'dummy.child.operation',
                undefined,
                trace.setSpan(
                    context.active(),
                    parentSpan
                )
            );

        // 4. Event on child span
        childSpan.addEvent(
            'child.started',
            {
                widget: 'usp'
            }
        );

        childSpan.end();
        parentSpan.end();
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
                'health.monitoring',
                undefined,
                parentContext
            );

        this.addEvent('health_reconciled',{
            remote_parent: true
        });
    }

    endOperation(resultLength: number) {
        // this.addEvent('api_reponse',{
        //     'ssr.html.length': resultLength
        // });

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