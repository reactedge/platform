import {OpenTelemetryObserver} from "./activity";
import {logger} from "../logger";
import {Span} from "@opentelemetry/api";

export class SsrRenderOperation {
    private readonly telemetry;

    private requestId: string;

    private userAgent: string;

    private traceId: string;

    private parentSpanId: string;

    private span: Span

    constructor() {
        this.telemetry =
            new OpenTelemetryObserver();
    }

    registerStart(headers: Record<string, any>): void {
        this.traceId = headers['x-trace-id'] ?? '';
        this.parentSpanId = headers['x-parent-span-id'] ?? '';
        this.userAgent = headers['user-agent']?? ''
        this.requestId = crypto.randomUUID();
        
        this.span = this.telemetry.startRemoteOperation(
            'ssr.render',
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

    logWidgetImported() {
        this.telemetry.addEvent('widget.imported', {})
    }

    logRenderingStarted() {
        this.telemetry.addEvent('widget.ssr.started', {})
    }

    logResponseSent(waitingLock: number) {
        logger.info('[SSR DONE]', {
            requestId: this.requestId
        });

        this.telemetry.addEvent('lock.wait.ms', { waitingLock })
        this.telemetry.addEvent('widget.ssr.sent', {})
        this.telemetry.endOperation()
    }

    logCompletion(resultLength: number) {
        logger.info('[SSR DONE]', {
            requestId: this.requestId,
            responseSize: resultLength
        });
        this.telemetry.addEvent('widget.ssr.completed', {
            resultLength
        })
    }

    logFailedSsr(
        error: unknown
    ): void {
        this.telemetry.failOperation(error)
    }

    getRequestId() {
        return this.requestId
    }

    addEvent(name: string, payload?: any) {
        this.telemetry.addEvent(name, payload)
    }

    getSpan() {
        return this.span
    }
}