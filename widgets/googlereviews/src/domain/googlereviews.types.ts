/* -------------------- */
/* Widget Contract      */
/* -------------------- */

export interface RawWidgetConfig {
    readonly data: WidgetConfig;
    readonly integrations?: WidgetIntegrations;
    readonly translations: TranslationsConfig;
}

export interface WidgetConfig {
    title: string;
    center: LatLng;
    zoom: number;
    region: LatLng[];
}

export interface LatLng {
    lat: number;
    lng: number;
}

export interface WidgetIntegrations {
    requires: IntegrationName[];
}

export type IntegrationName =
    | "cloudflare"
    | "googleMaps"
    | "magento"
    | "intentApi";

export interface GoogleReviewsWidgetConfig {
    readonly data: GoogleReviewsDataConfig;
    readonly integration?: {
        readonly requires?: readonly GoogleMapsIntegrationName[];
    };
    readonly translations?: GoogleReviewsTranslationsConfig
}

export interface GoogleReviewsDataConfig {
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

export type GoogleReviewsTranslationsConfig = Record<string, string> | undefined;


/* -------------------- */
/* Resolved Config      */
/* -------------------- */

export interface WidgetConfig {
    readonly data: GoogleReviewsDataConfig;
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly translations: GoogleReviewsTranslationsConfig
}
