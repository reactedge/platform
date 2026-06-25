import { SitemapReader } from "./sitemap-reader";
import { config } from "../../config"
import { BatchLoader, PerformanceRun } from "./batch-loader";
import { PerformanceComparison } from "./types";
import { OpenTelemetryObserver } from "../../observability/activity";
import { UrlLoader } from "./url-loader"

export class PerformanceValidator {

    async validateSitemap(telemetry: OpenTelemetryObserver): Promise<PerformanceComparison[]> {
        const sitemapReader = new SitemapReader()

        const urls =
            await sitemapReader.read(config.sitemap.url);

        const batchLoader = new BatchLoader(
            new UrlLoader()
        )

        const initial =
            await batchLoader.measure(urls, telemetry);

        const verification =
            await batchLoader.measureColdUrls(initial, telemetry);

        return this.compare(
            initial,
            verification
        );
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
}