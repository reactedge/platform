import { SpanStatusCode } from '@opentelemetry/api';

import { logger } from './logger';

export class FeatureHealthOperation {
    private readonly telemetry;

    private requestId: string;

    private userAgent: string;

    private traceId: string;

    private parentSpanId: string;

    constructor() {
        //this.telemetry = new OpenTelemetryObserver();
    }
    registerStart(headers: Record<string, any>): void {
        this.traceId = headers['x-trace-id'] ?? '';
        this.parentSpanId = headers['x-parent-span-id'] ?? '';
        this.userAgent = headers['user-agent'] ?? '';
        this.requestId = crypto.randomUUID();

        this.telemetry.startOperation(
            this.traceId,
            this.parentSpanId
        );

        logger.info('[FEATURE HEALTH START]', {
            requestId: this.requestId,
            traceId: this.traceId,
            parentSpanId: this.parentSpanId
        });
    }

    logObservation(payload: {
        widget: string;
        check: string;
    }): void {
        logger.info('[FEATURE HEALTH OBSERVATION]', {
            requestId: this.requestId,
            widget: payload.widget,
            check: payload.check,
            userAgent: this.userAgent
        });

        this.telemetry.addEvent('observation.completed', {
            requestId: this.requestId,
            widget: payload.widget,
            check: payload.check
        });
    }

    logAssessment(result: {
        widget: string;
        healthy: boolean;
        issue?: string;
    }): void {
        logger.info('[FEATURE HEALTH ASSESSMENT]', {
            requestId: this.requestId,
            widget: result.widget,
            healthy: result.healthy,
            issue: result.issue
        });

        this.telemetry.addEvent('assessment.completed', {
            requestId: this.requestId,
            widget: result.widget,
            healthy: result.healthy,
            issue: result.issue
        });
    }

    logCompletion(): void {
        logger.info('[FEATURE HEALTH COMPLETE]', {
            requestId: this.requestId
        });

        this.telemetry.endOperation();
    }

    logFailure(error: unknown): void {
        logger.error('[FEATURE HEALTH FAILED]', {
            requestId: this.requestId,
            error
        });

        this.telemetry.failOperation(error);

        this.telemetry.addEvent('operation.failed', {
            requestId: this.requestId
        });

        this.telemetry.setStatus(
            SpanStatusCode.ERROR,
            error instanceof Error ? error.message : 'Unknown error'
        );
    }

    getRequestId(): string {
        return this.requestId;
    }
}