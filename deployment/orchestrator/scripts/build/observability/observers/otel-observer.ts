import type {BaseEvent} from "../contracts/base_event.ts";
import type {ReportObserver} from "./report-observer.ts";
import type { Span } from "@opentelemetry/api";
import {getTracer} from "../tracing.ts";

export class OpenTelemetryObserver
    implements ReportObserver {

    private span: Span

    constructor(spanName: string) {
        this.span =
            getTracer().startSpan(
                spanName
            );
    }

    notify(
        event: BaseEvent,
        span?: Span
    ): void {
        const targetSpan =
            span ?? this.span;

        const attributes: Record<string, string> = {};

        for (const [key, value] of Object.entries(event.payload)) {
            attributes[key] =
                JSON.stringify(value);
        }

        targetSpan.setAttributes({
            service: event.source.service,
            component: event.source.component
        });

        targetSpan.addEvent(
            event.eventType,
            attributes
        );
    }

    end(): void {
        this.span.end();
    }
}