import {OpenTelemetryObserver} from "./activity";
import {logger} from "../logger";
import {SsrRenderOperation} from "./ssr-operation";

export class LockOperation {
    private readonly telemetry;

    private readonly ssrOperation: SsrRenderOperation

    private start: number

    private waitingDelay: number

    constructor(ssrOperation: SsrRenderOperation) {
        this.telemetry =
            new OpenTelemetryObserver();
        this.ssrOperation = ssrOperation
    }

    registerStart(): void {
        const spanContext = this.ssrOperation.getSpan().spanContext();

        const parentSpanId = spanContext.spanId;
        const traceId = spanContext.traceId;

        this.start = performance.now();

        this.telemetry.startOperation(
            'ssr.lock.wait',
            traceId,
            parentSpanId
        );

        logger.info('[LOCK START]', {
            traceId,
            parentSpanId,
        });
    }

    logLockAcquired(payload?: any) {
        logger.info('[LOCK ACQUIRED]', {});

        this.waitingDelay = performance.now() - this.start

        this.telemetry.addEvent(
            "ssr.lock.acquired", {
                waitMs: this.waitingDelay
            }
        );

        this.telemetry.endOperation()
    }

    logFailedLock(
        error: unknown
    ): void {
        this.telemetry.failOperation(error)
    }

    addEvent(name: string, payload?: any) {
        this.telemetry.addEvent(name, payload)
    }

    getWaitingLock() {
        return this.waitingDelay;
    }
}