import {OpenTelemetryObserver} from "./observability/activity";
import {logger} from "./logger";
import {SpanStatusCode} from "@opentelemetry/api";

export class SsrRenderOperation {
    private readonly telemetry;

    private requestId: string;

    private userAgent: string;

    private traceId: string;

    private parentSpanId: string;

    constructor() {
        this.telemetry =
            new OpenTelemetryObserver();
    }

    registerStart(headers: Record<string, any>): void {
        this.traceId = headers['x-trace-id'] ?? '';
        this.parentSpanId = headers['x-parent-span-id'] ?? '';
        this.userAgent = headers['user-agent']?? ''
        this.requestId = crypto.randomUUID();
        
        this.telemetry.startOperation(
            this.traceId,
            this.parentSpanId
        );

        logger.info('[SSR START]', {
            requestId: this.requestId,
            traceId: this.traceId,
            parentSpanId: this.parentSpanId,
        });
    }

    logPayload(payload: { contract: any; contractFile: any; runtimeConfig: any; widget: any; widgetId: any }) {
        logger.info('[SSR PAYLOAD]', {
            requestId: this.requestId,
            widget: payload.widget,
            contractFile: payload.contractFile,
            runtime: payload.runtimeConfig,
            userAgent: this.userAgent
        });

        this.telemetry.addEvent('payload.loaded', {
            requestId: this.requestId,
            widget: payload.widget,
            contractFile: payload.contractFile,
            runtime: payload.runtimeConfig,
            userAgent: this.userAgent
        })
    }

    lodCompletion(resultLength: number) {
        logger.info('[SSR DONE]', {
            requestId: this.requestId,
            responseSize: resultLength
        });

        this.telemetry.endOperation(resultLength)
    }

    logFailedSsr(
        error: unknown
    ): void {
        this.telemetry.failOperation(error)
    }

    getRequestId() {
        return this.requestId
    }
}