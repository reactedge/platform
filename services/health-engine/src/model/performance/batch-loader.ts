import { SitemapEntry, PerformanceEntry } from "./types";
import { UrlLoader } from "./url-loader";
import { config } from "../../config"
import { OpenTelemetryObserver } from "../../observability/activity"

export class BatchLoader {
    constructor(
        private readonly urlLoader: UrlLoader
    ) {
    }

    async measure(
        entries: SitemapEntry[],
        telemetry: OpenTelemetryObserver
    ): Promise<PerformanceRun> {
        const run = new PerformanceRun();

        let failures = 0;

        for (const entry of entries) {
            const load = await this.loadUrl(entry, telemetry)

            if (load) {
                run.add(load);
            } else {
                telemetry.logObservation(
                    'health.performance.page.failed',
                    {
                        'page.id': entry.id,
                        'page.url': entry.url,
                        'failure.count': failures,
                        'failure.max': config.sitemap.maxFailures
                    }
                );

                failures++;

                if (failures >= config.sitemap.maxFailures) {
                    telemetry.logObservation(
                        'health.performance.aborted',
                        {
                            'failure.count': failures
                        }
                    );

                    break;
                }
            }
        }

        return run;
    }

    async measureColdUrls(
        coldRun: PerformanceRun,
        telemetry: OpenTelemetryObserver
    ): Promise<PerformanceRun> {
        const run = new PerformanceRun();

        let failures = 0;

        for (const entry of coldRun.getEntries()) {
            if (entry.cacheHit) {
                run.add(entry);
                continue;
            }

            const load = await this.loadUrl(entry, telemetry)

            if (!load) {
                telemetry.logObservation(
                    'health.performance.page.failed',
                    {
                        'page.id': entry.id,
                        'page.url': entry.url,
                        'failure.count': failures,
                        'failure.max': config.sitemap.maxFailures
                    }
                );

                failures++;

                if (failures >= config.sitemap.maxFailures) {
                    telemetry.logObservation(
                        'health.performance.aborted',
                        {
                            'failure.count': failures
                        }
                    );

                    break;
                }
            }
        }

        return run;
    }

    async loadUrl(entry: SitemapEntry, telemetry: OpenTelemetryObserver) {
        telemetry.logObservation(
            'health.performance.page.started',
            {
                'page.id': entry.id,
                'page.label': entry.label,
                'page.url': entry.url
            }
        );

        const result =
            await this.urlLoader.fetchText(entry.url);

        telemetry.logObservation(
            'health.performance.page.completed',
            {
                'page.id': entry.id,
                'page.label': entry.label,
                'page.url': entry.url,
                'http.status': result.status,
                'duration.ms': result.durationMs,
                'healthy': result.healthy
            }
        );

        if (result.healthy) {
            return {
                id: entry.id,
                label: entry.label,
                url: entry.url,
                ...result
            };
        }
    }
}

export class PerformanceRun {

    private readonly entries = new Map<string, PerformanceEntry>();

    add(entry: PerformanceEntry): void {
        this.entries.set(entry.id, entry);
    }

    getEntries(): PerformanceEntry[] {
        return [...this.entries.values()];
    }

    get(id: string): PerformanceEntry | undefined {
        return this.entries.get(id);
    }
}