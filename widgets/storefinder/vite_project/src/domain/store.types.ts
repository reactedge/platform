/* -------------------- */
/* Widget Contract      */
/* -------------------- */

export interface Store {
    readonly name: string,
    readonly lat: number;
    readonly lng: number;
    readonly hours?: string;
}

export type StoreWithDistance = Store & { distance: number | null };


export interface StoreFinderWidgetConfig {
    readonly data: StoreFinderDataConfig;
    readonly integration?: {
        readonly requires?: readonly GoogleMapsIntegrationName[];
    };
    readonly translations?: TranslationsConfig
}

export interface StoreFinderDataConfig {
    readonly stores: readonly Store[];
    readonly defaultCenter: LatLng;
    readonly zoom: number;
    readonly country: string
}

export type LatLng = {
    readonly lat: number;
    readonly lng: number;
};

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
    };
}

export type TranslationsConfig = Record<string, string> | undefined;


/* -------------------- */
/* Resolved Config      */
/* -------------------- */

export interface ResolvedStoreFinderConfig {
    readonly data: StoreFinderDataConfig;
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly translations: TranslationsConfig
}

export type DistanceUnit = 'km' | 'mi';

export interface DistanceOption {
    label: string;
    value: number;
}

export const BASE_RADIUS_KM = [10, 50, 200, 500];
export const BASE_RADIUS_MI = [10, 30, 100, 300];
