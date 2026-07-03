import dotenv from 'dotenv';
dotenv.config();
import appRoot from 'app-root-path';

export type configInfo = {
    port: number;
    frontendUrl: string;
    cdnFolder: string,
    route: {
        validationPrefix: string;
    },
    rootDir: string;
    observability: {
        otelHost: string;
        serviceName: string;
    },
    openai: {
        model: string;
        performance: number;
        apiKey: string;
    },
    repairPromptVersion: string
    sitemap: {
        url: string,
        maxFailures: number
    },
    health: {
        platformSnapshotInterval: number,
        platformSignalsUrl: string
        backgroundTraffic: {
            enabled: boolean,
            concurrentRequests: number
        }
    }
}

export const config: configInfo = {
    port: (process.env.PORT === undefined) ? 8080 : Number(process.env.PORT),

    frontendUrl: (process.env.FRONTEND_URL === undefined) ? 'http://localhost:3001' : process.env.FRONTEND_URL,
    cdnFolder: (process.env.CDN_FOLDER === undefined) ? 'csv_export' : process.env.CDN_FOLDER,

    /**
     * Routes access
     */
    route: {
        validationPrefix: '/validation'
    },
    rootDir: appRoot.resolve('/'),
    observability: {
        otelHost: (process.env.OTEL_HOST === undefined) ? 'http://localhost:4318' : process.env.OTEL_HOST,
        serviceName: (process.env.OTEL_HEALTH_SERVICE === undefined) ? 'reactedge-health' : process.env.OTEL_HEALTH_SERVICE,
    },
    openai: {
        model: (process.env.OPENAI_MODEL === undefined) ? 'gpt-4o-mini' : process.env.OPENAI_MODEL,
        performance: Number(process.env.OPENAI_PERFORMANCE ?? 0.2),
        apiKey: (process.env.OPENAI_API_KEY === undefined) ? 'rrfdf' : process.env.OPENAI_API_KEY
    },
    repairPromptVersion: (process.env.REPAIR_PROMPT_VERSION === undefined) ? 'v1' : process.env.REPAIR_PROMPT_VERSION,
    sitemap: {
        url: process.env.SITEMAP_URL!,
        maxFailures: process.env.SITEMAP_MAX_FAILURES
            ? parseInt(process.env.SITEMAP_MAX_FAILURES, 10)
            : 5
    },
    health: {
        platformSnapshotInterval: process.env.HEALTH_PLATFORM_SNAPSHOT_INTERVAL
            ? parseInt(process.env.HEALTH_PLATFORM_SNAPSHOT_INTERVAL, 10)
            : 50,

        platformSignalsUrl: process.env.HEALTH_PLATFORM_SIGNALS_URL!,

        backgroundTraffic: {
            enabled: process.env.HEALTH_BACKGROUND_TRAFFIC_ENABLED === 'true',
            concurrentRequests: process.env.HEALTH_BACKGROUND_TRAFFIC_CONCURRENCY
                ? parseInt(process.env.HEALTH_BACKGROUND_TRAFFIC_CONCURRENCY, 10)
                : 10,
        }
    }
}