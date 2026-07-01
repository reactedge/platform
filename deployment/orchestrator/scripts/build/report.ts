import type {ReportObserver} from "./observability/observers/report-observer.ts";
import type {BaseEvent} from "./observability/contracts/base_event.ts";
import {buildBaseEvent} from "./observability/contracts/base_event.ts";
import {context, SpanStatusCode, trace} from "@opentelemetry/api";
import type { Span } from '@opentelemetry/api';
import {getTracer} from "./observability/tracing.ts";

export type ReportLevel =
    | 'info'
    | 'success'
    | 'warning'
    | 'error';

export interface ReportEntry {
    timestamp: Date;
    level: ReportLevel;
    message: string;
    context?: Record<string, unknown>;
}

export class Report {
    private entries: ReportEntry[] = [];
    private scopes = new Map<
        string,
        ReportScope
    >();

    private observers: ReportObserver[] = [];

    addObserver(
        observer: ReportObserver
    ): void {
        this.observers.push(observer);
    }

    private notifyObservers(
        entry: ReportEntry,
        span?: Span
    ): void {
        const event =
            this.buildBaseEventFromReport(entry);

        for (const observer of this.observers) {
            observer.notify(
                event,
                span
            );
        }
    }

    createScope(
        spanName: string
    ): ReportScope {

        const span =
            getTracer().startSpan(
                spanName
            );

        const scope =
            new ReportScope(
                span
            );

        const scopes =
            this.scopes.get(
                spanName
            ) ?? [];

        this.scopes.set(
            spanName,
            scope
        );

        return scope;
    }

    info(
        message: string,
        context?: Record<string, unknown>,
        span?: Span
    ) {
        this.add(
            'info',
            message,
            context,
            span
        );
    }

    success(message: string, context?: Record<string, unknown>, span?: Span) {
        this.add('success', message, context, span);
    }

    warning(message: string, context?: Record<string, unknown>, span?: Span) {
        this.add('warning', message, context, span);
    }

    error(message: string, context?: Record<string, unknown>, span?: Span) {
        this.add('error', message, context, span);
    }

    renderConsole(): void {

        console.log('\n====================================');
        console.log('ReactEdge Build Report');
        console.log('====================================');

        for (const entry of this.entries) {

            const prefix = {
                info: '[INFO]',
                success: '[OK]',
                warning: '[WARN]',
                error: '[ERROR]'
            }[entry.level];

            console.log(
                `${prefix} ${entry.message}`
            );

            if (entry.context) {
                console.log(
                    `       ${JSON.stringify(entry.context)}`
                );
            }
        }

        console.log('====================================');
    }

    publishSummary(): void {
        const tracer = getTracer()
        const parentSpan =
            tracer.startSpan(
                'build-summary'
            );

        for (const [scopeName, scope] of this.scopes) {
            const childSpan =
                tracer.startSpan(
                    scopeName,
                    undefined,
                    trace.setSpan(
                        context.active(),
                        parentSpan
                    )
                );

            const entries = scope.getEntries()

            const hasErrors =
                entries.some(
                    entry => entry.level === 'error'
                );

            if (hasErrors) {
                childSpan.setStatus({
                    code: SpanStatusCode.ERROR
                });
            }

            for (const entry of entries) {
                const attributes: Record<string, string> = {
                    level: entry.level,
                    timestamp: entry.timestamp.toISOString(),
                    widgetName: scopeName,
                    instance: entry.context?.widget as string
                };

                if (entry.context) {
                    for (const [key, value] of Object.entries(entry.context)) {
                        attributes[key] = String(value);
                    }
                }

                childSpan.addEvent(
                    entry.message,
                    attributes
                );
            }

            childSpan.end()
        }

        parentSpan.end();
    }

    getEntries(): ReportEntry[] {
        return this.entries;
    }

    private add(
        level: ReportLevel,
        message: string,
        context?: Record<string, unknown>,
        span?: Span
    ) {
        const event = {
            timestamp: new Date(),
            level,
            message,
            context
        };

        if (!span) this.entries.push(event);

        this.notifyObservers(event, span);
    }

    private buildBaseEventFromReport(
        entry: ReportEntry
    ): BaseEvent {
        return buildBaseEvent(
            entry.level,
            {
                message: entry.message,
                ...entry.context
            },
            {
                service: 'reactedge-build',
                component: 'report'
            }
        );
    }
}

export class ReportScope {
    private readonly span: Span;
    private summary: Record<string, unknown> = {};
    private entries: ReportEntry[] = [];

    constructor(
        span: Span
    ) {
        this.span = span;
    }

    info(
        message: string,
        context?: Record<string, unknown>
    ) {
        this.add('info', message, context);
    }

    success(message: string, context?: Record<string, unknown>) {
        this.add('success', message, context);
    }

    warning(message: string, context?: Record<string, unknown>) {
        this.add('warning', message, context);
    }

    error(message: string, context?: Record<string, unknown>) {
        this.add('error', message, context);
    }

    complete(
        message: string,
        context?: Record<string, unknown>
    ) {
        if (context) {
            Object.assign(
                this.summary,
                context
            );
        }
    }

    private add(
        level: ReportLevel,
        message: string,
        context?: Record<string, unknown>
    ) {
        const event = {
            timestamp: new Date(),
            level,
            message,
            context
        };

        this.entries.push(event);
    }

    getEntries() {
        return this.entries;
    }

    end() {
        this.span.end();
    }
}