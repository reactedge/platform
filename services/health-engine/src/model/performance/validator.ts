import { SitemapReader } from "./sitemap-reader";
import { config } from "../../config"
import { BatchLoader, PerformanceRun } from "./batch-loader";
import {PerformanceComparison, SitemapEntry} from "./types";
import { OpenTelemetryObserver } from "../../observability/activity";
import { UrlLoader } from "./url-loader"

export class PerformanceValidator {

    async validateSitemap(
        telemetry: OpenTelemetryObserver
    ): Promise<PerformanceComparison[]> {

        const sitemapReader = new SitemapReader();

        const urls = await sitemapReader.read(config.sitemap.url);

        const batchLoader = new BatchLoader(
            new UrlLoader()
        );

        const traffic = this.generateBackgroundTraffic(
            urls,
            telemetry
        );

        try {

            const initial =
                await batchLoader.measure(urls, telemetry);

            console.log(
                'initial run completed',
                initial.getEntries().length
            );

            const verification =
                await batchLoader.measureColdUrls(
                    initial,
                    telemetry
                );

            console.log(
                'verification run completed',
                verification.getEntries().length
            );

            return this.compare(
                initial,
                verification
            );

        } finally {

            this.stopBackgroundTraffic();

            console.log(
                'health.background.requests',
                this.backgroundRequestCount
            );

            await traffic;
        }
    }

    compare(
        baseline: PerformanceRun,
        verification: PerformanceRun,
    ): PerformanceComparison[] {

        return verification.getEntries().map(verification => {
            const baselineEntry =
                baseline.get(verification.id);

            return {
                id: verification.id,
                label: verification.label,
                url: verification.url,
                baselineMs: baselineEntry?.durationMs ?? 0,
                verificationMs: verification.durationMs,
                improvementMs:
                    (baselineEntry?.durationMs ?? 0) - verification.durationMs,
                baselineCacheHit: baselineEntry?.cacheHit ?? false,
                verificationCacheHit: verification.cacheHit,
                healthy: verification.healthy
            };
        })
    }

    private backgroundTrafficRunning = false;
    private backgroundRequestCount = 0;

    async generateBackgroundTraffic(
        entries: SitemapEntry[],
        telemetry: OpenTelemetryObserver
    ): Promise<void> {

        this.backgroundTrafficRunning = true;

        const workers = Array.from(
            { length: config.health.backgroundTraffic.concurrentRequests },
            () => this.runBackgroundWorker(entries, telemetry)
        );

        await Promise.all(workers);
    }

    private async runBackgroundWorker(
        entries: SitemapEntry[],
        telemetry: OpenTelemetryObserver
    ): Promise<void> {
        const batchLoader = new BatchLoader(
            new UrlLoader()
        )

        while (this.backgroundTrafficRunning) {

            const entry = entries[
                Math.floor(Math.random() * entries.length)
                ];

            await batchLoader.loadUrl(entry, telemetry);
            this.backgroundRequestCount++;
        }
    }

    stopBackgroundTraffic(): void {
        this.backgroundTrafficRunning = false;
    }
}