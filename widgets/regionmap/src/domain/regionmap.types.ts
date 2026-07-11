export type MapPolygon = [LatLng, LatLng, LatLng, ...LatLng[]];
export interface LatLng {
    lat: number;
    lng: number;
}

export type TranslationsConfig = Record<string, string> | undefined;

export interface RegionMapDataConfig {
    readonly title?: string;
    readonly center: LatLng;
    readonly zoom: number;
    readonly region: MapPolygon;
}

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

/* -------------------- */
/* Resolved Config      */
/* -------------------- */

export interface WidgetConfig {
    readonly data: RegionMapDataConfig;
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly translations: TranslationsConfig
}