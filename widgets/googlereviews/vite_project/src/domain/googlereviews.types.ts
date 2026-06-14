/* -------------------- */
/* Widget Contract      */
/* -------------------- */


import type {RawWidgetConfig} from "../Config.ts";

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
