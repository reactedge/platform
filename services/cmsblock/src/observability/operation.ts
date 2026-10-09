import {
    Attributes,
    AttributeValue,
    context,
    type Context,
    Span,
    SpanStatusCode,
    trace
} from "@opentelemetry/api";

export class Operation {
    private ended = false;

    constructor(private readonly span: Span) {}

    addEvent(name: string, attributes: Attributes = {}): void {
        this.span.addEvent(name, attributes);
    }

    setAttribute(key: string, value: AttributeValue): void {
        this.span.setAttribute(key, value);
    }

    getContext(): Context {
        return trace.setSpan(context.active(), this.span);
    }

    end(): void {
        if (this.ended) return;
        this.ended = true;
        this.span.end();
    }

    succeed(): void {
        if (this.ended) return;
        this.span.setStatus({code: SpanStatusCode.OK});
        this.end();
    }

    complete(statusCode: number): void {
        if (this.ended) return;
        this.span.setAttribute('http.response.status_code', statusCode);
        this.span.setStatus({
            code: statusCode >= 400 ? SpanStatusCode.ERROR : SpanStatusCode.OK,
            message: statusCode >= 400 ? `HTTP ${statusCode}` : undefined
        });
        this.end();
    }

    fail(error: unknown): void {
        if (this.ended) return;
        this.ended = true;
        const err = error instanceof Error ? error : new Error(String(error));
        this.span.recordException(err);
        this.span.setStatus({code: SpanStatusCode.ERROR, message: err.message});
        this.span.end();
    }
}
