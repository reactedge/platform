import { SsrRenderOperation } from "./ssr-operation";

let renderLock: Promise<void> = Promise.resolve();

export async function withRenderLock<T>(
    operation: SsrRenderOperation,
    fn: () => Promise<T>
): Promise<T> {
    operation.registerStart();

    const previous = renderLock;
    let release!: () => void;

    renderLock = new Promise<void>(resolve => {
        release = resolve;
    });

    await previous;
    await new Promise(resolve => setTimeout(resolve, 3000));

    operation.logLockAcquired();

    try {
        return await fn();
    } catch (e) {
        operation.logFailedLock(e)
    } finally {
        release();
    }
}