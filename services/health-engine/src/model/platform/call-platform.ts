import { OpenTelemetryObserver } from "../../observability/activity";
import { config } from "../../config";

export async function savePlatformStatusSnapshot(
    telemetry: OpenTelemetryObserver
): Promise<void> {

    const operation = telemetry.startChildOperation('health.platform.snapshot');

    try {
        const response = await fetch(
            `${config.health.platformSignalsUrl}/status`
        );

        if (!response.ok) {
            operation.fail(
                new Error(`Unexpected HTTP ${response.status}`)
            );
            return;
        }

        const snapshot = await response.json();

        operation.setAttribute(
            'platform.hostname',
            snapshot.platform.hostname
        );

        operation.setAttribute(
            'platform.environment',
            snapshot.platform.environment
        );

        operation.setAttribute(
            'platform.cpu.usage_percent',
            snapshot.signals.cpu.usagePercent
        );

        operation.setAttribute(
            'platform.memory.usage_percent',
            snapshot.signals.memory.usagePercent
        );

        operation.setAttribute(
            'platform.swap.usage_percent',
            snapshot.signals.memory.swap.usagePercent
        );

        operation.setAttribute(
            'platform.redis.connected',
            snapshot.signals.redis.connected
        );

        operation.setAttribute(
            'platform.redis.used_memory_bytes',
            snapshot.signals.redis.usedMemoryBytes
        );

        operation.setAttribute(
            'platform.varnish.hit_rate',
            snapshot.signals.varnish.cacheHitRate
        );

        operation.setAttribute(
            'platform.varnish.hits',
            snapshot.signals.varnish.cacheHits
        );

        operation.setAttribute(
            'platform.varnish.misses',
            snapshot.signals.varnish.cacheMisses
        );

        operation.end();

    } catch (error) {
        operation.fail(
            error instanceof Error ? error : new Error(String(error))
        );
    }
}