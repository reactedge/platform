import type {ObservabilityConfig} from "@reactedge/framework/observability/config";

/** Access labels currently supported by ReactEdge identity. */
export type ReactEdgeUserAccess = 'seller';

/**
 * Optional presentation context derived from the host's authenticated user.
 *
 * IMPORTANT: this is browser-visible and can be modified by the user.
 * Never use it to authorise reads, writes, or privileged operations.
 */
export interface ReactEdgeRuntimeIdentity {
    readonly userId: string;
    readonly access: readonly ReactEdgeUserAccess[];
}

/**
 * Services exposed by the ReactEdge platform to widgets.
 *
 * Widgets may ignore services they do not require.
 */
export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;

    /** UI context only. Mutations must authorise against a trusted server session. */
    readonly identity?: ReactEdgeRuntimeIdentity;

    readonly context?: {
        readonly storeCode?: string;
        readonly sku?: string;
    };

    readonly rendering?: {
        readonly userAgent?: "mobile" | "desktop";
    };

    readonly observability?: ObservabilityConfig
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