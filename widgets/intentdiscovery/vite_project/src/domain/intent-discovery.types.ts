/* -------------------- */
/* Runtime              */
/* -------------------- */

export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;
    category: string;
    storeCode: string;
}

export interface ReactEdgeRuntimeIntegrations {
    readonly magentoGraphql: {
        readonly api: string;
        readonly internalApi?: string
    };
    readonly intentApi?: {
        readonly baseUrl: string;
    };
}

/* -------------------- */
/* Resolved Config      */
/* -------------------- */

export interface ResolvedIntentDiscoveryConfig {
    readonly data: IntentDiscoveryDataConfig;
    readonly runtime: ResolvedRuntimeConfig;
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly translations: IntentDiscoveryTranslationsConfig
}

export interface ResolvedRuntimeConfig {
    category: string;
    storeCode: string;
}

export type IntentDiscoveryTranslationsConfig = Record<string, string> | undefined;

export type OptionLabelMap = Map<string, Map<string, string>>

export type MagentoIntegrationName = 'magentoGraphql';

export interface IntentDiscoveryDataConfig {
    categoryUrlKey: string;
    /**
     * Codes used to determine the order of preference steps. These attributes
     * will be **excluded** from the attribute layer display; the layer renders
     * only attributes not listed here.
     */
    attributeExcludedInLayer: string[];
    enabledCategories: string[];
    attributeOrder: string[];
    /**
     * Optional mapping of step codes (usually attribute codes plus the special
     * `price`/`result` values) to labels shown in the finder UI.
     */
    labelMap?: Record<string, string>;
    ai: {
        "enabled": boolean,
        "activationThreshold": number,
        "matchThreshold": number,
        "minIntentScore": number,
        "maxProductsForAnalysis": number
    }
}