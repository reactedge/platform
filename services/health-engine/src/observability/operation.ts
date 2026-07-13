import {Attributes, AttributeValue, Span, SpanStatusCode} from "@opentelemetry/api";

export class Operation {
    constructor(
        private readonly span: Span
    ) {}

    addEvent(
        name: string,
        attributes: Attributes = {}
    ): void {
        this.span.addEvent(name, attributes);
    }

    setAttribute(
        key: string,
        value: AttributeValue
    ): void {
        this.span.setAttribute(key, value);
    }

    end(): void {
        this.span.end();
    }

    fail(error: unknown): void {
        const err =
            error instanceof Error
                ? error
                : new Error(String(error));

        this.span.recordException(err);

        this.span.setStatus({
            code: SpanStatusCode.ERROR,
            message: err.message
        });

        this.span.end();
    }
}