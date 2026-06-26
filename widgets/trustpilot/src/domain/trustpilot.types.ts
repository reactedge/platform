/* -------------------- */
/* Widget Contract      */
/* -------------------- */


export interface TrustpilotWidgetConfig {
    readonly data: TrustpilotDataConfig;
    readonly integration?: {
        readonly requires?: readonly GoogleMapsIntegrationName[];
    };
    readonly translations?: TrustpilotTranslationsConfig
}

export interface TrustpilotDataConfig {
    title: string
}


export type GoogleMapsIntegrationName = 'googleMaps';

/* -------------------- */
/* Runtime              */
/* -------------------- */

export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;
}

export interface ReactEdgeRuntimeIntegrations {
    readonly googleMaps?: {
        readonly apiKey: string;
        readonly placeId: string;
    };
}

export type TrustpilotTranslationsConfig = Record<string, string> | undefined;


/* -------------------- */
/* Resolved Config      */
/* -------------------- */

export interface ResolvedTrustpilotConfig {
    readonly data: TrustpilotDataConfig;
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly translations: TrustpilotTranslationsConfig
}
