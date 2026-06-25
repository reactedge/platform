import { FetchResult } from "./types";

export class UrlLoader {

    async fetchText(url: string): Promise<FetchResult> {

        const started = performance.now();

        try {

            const response = await fetch(url);

            const cache =
                response.headers.get('x-magento-cache-debug');

            return {
                healthy: response.ok,
                status: response.status,
                durationMs: performance.now() - started,
                body: await response.text(),
                cacheStatus: cache ?? '',
                cacheHit: cache === 'HIT'
            };

        } catch (e) {

            return {
                healthy: false,
                durationMs: performance.now() - started,
                error: e instanceof Error
                    ? e.message
                    : 'Unknown error'
            };
        }
    }
}