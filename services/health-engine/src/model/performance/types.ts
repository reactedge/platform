interface PerformanceResult {
    url: string;
    status: number;
    durationMs: number;
    healthy: boolean;
}

interface PerformanceConfig {
    thresholdMs: number;
    maxFailures: number;
}

export interface PerformanceEntry {
    id: string;
    label: string;
    url: string;
    cacheStatus?: string,
    cacheHit?: boolean,
    durationMs: number;
    healthy: boolean;

}

export type PerformanceType = 'baseline' | 'verification';

export interface SitemapEntry {
    id: string;
    url: string;
    label: string;
}

export interface FetchResult {
    healthy: boolean;
    status?: number;
    durationMs: number;
    cacheHit?: boolean;
    cacheStatus?: string;
    body?: string;
    error?: string;
}

export interface PerformanceComparison {
    label: string;
    url: string;

    baselineMs?: number;
    verificationMs?: number;

    improvementMs: number;
    healthy: boolean;

    error?: string;
}