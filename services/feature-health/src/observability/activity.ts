import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { context, trace, type Tracer, SpanStatusCode, Span } from "@opentelemetry/api";
import { config } from "../config.ts";

export class OpenTelemetryObserver {
    private span?: Span

    private tracer: Tracer
    constructor() {
        const exporter = new OTLPTraceExporter({
            url: `${config.observability.otelHost}/v1/traces`
        });

        const provider = new NodeTracerProvider({
            resource: resourceFromAttributes({
                'service.name': config.observability.serviceName,
                'service.version': '1.0.0'
            }),
            spanProcessors: [
                new BatchSpanProcessor(exporter)
            ]
        });

        provider.register();

        this.tracer = trace.getTracer(config.observability.serviceName);
        // // 1. Dummy parent span
        // const parentSpan =
        //     this.tracer.startSpan(
        //         'dummy.operation'
        //     );
        //
        // // 2. Event on parent span
        // parentSpan.addEvent(
        //     'parent.started',
        //     {
        //         status: 'ok'
        //     }
        // );
        //
        // // 3. Child span
        // const childSpan =
        //     this.tracer.startSpan(
        //         'dummy.child.operation',
        //         undefined,
        //         trace.setSpan(
        //             context.active(),
        //             parentSpan
        //         )
        //     );
        //
        // // 4. Event on child span
        // childSpan.addEvent(
        //     'child.started',
        //     {
        //         widget: 'usp'
        //     }
        // );
        //
        // childSpan.end();
        // parentSpan.end();
    }

    startOperation(name: string, headers: Request['headers']): void {
        this.span =
            this.tracer.startSpan(
                name
            );

        this.logObservation('request_headers', headers)
    }

    endOperation() {
        // this.addEvent('api_reponse',{
        //     'ssr.html.length': resultLength
        // });
        if (this.span === undefined) {
            throw new Error('No operation was started')
        }

        this.span.end();
    }

    failOperation(error: unknown) {
        if (this.span === undefined) {
            throw new Error('No operation was started')
        }

        this.span.recordException(
            error as Error
        );

        this.span.setStatus({
            code: SpanStatusCode.ERROR,
            message: String(error)
        });

        this.span.end();
    }

    logObservation(
        name: string,
        payload: Record<string, any>
    ) {
        if (this.span === undefined) {
            throw new Error('No operation was started')
        }

        this.span.addEvent(
            name,
            payload
        );
    }
}