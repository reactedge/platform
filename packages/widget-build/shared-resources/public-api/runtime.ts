/**
 * Services exposed by the ReactEdge platform to widgets.
 *
 * Widgets may ignore services they do not require.
 */
export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;

    readonly context?: {
        readonly storeCode?: string;
        readonly sku?: string;
    };

    readonly rendering?: {
        readonly userAgent?: "mobile" | "desktop";
    };
}

export interface ReactEdgeRuntimeIntegrations {
    readonly cloudflare?: {
        readonly siteKey: string;
    };

    readonly googleMaps?: {
        readonly apiKey: string;
        readonly placeId?: string;
    };

    readonly magentoGraphql?: {
        readonly api: string;
    };
}