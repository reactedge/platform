import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {context, trace, type Tracer} from "@opentelemetry/api";
import {getConfig} from "../../config.ts";

let tracer: Tracer;

export function setupTelemetry() {
    const CONFIG = getConfig()
    const exporter = new OTLPTraceExporter({
        url: CONFIG.otelHost
    });

    console.log('Telemetry Service', CONFIG.otelServiceName)

    const provider = new WebTracerProvider({
        resource: resourceFromAttributes({
            'service.name': CONFIG.otelServiceName,
            'service.version': '1.0.0'
        }),
        spanProcessors: [
            new BatchSpanProcessor(exporter)
        ]
    });

    provider.register();

    tracer = trace.getTracer(CONFIG.otelServiceName);

    // // 1. Dummy parent span
    // const parentSpan =
    //     tracer.startSpan(
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
    //     tracer.startSpan(
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

export function getTracer() {
    return tracer;
}