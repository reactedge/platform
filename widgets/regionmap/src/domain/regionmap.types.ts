export type Polygon = [LatLng, LatLng, LatLng, ...LatLng[]];
export interface LatLng {
    lat: number;
    lng: number;
}

export interface RegionMapWidgetConfig {
    readonly data: RegionMapDataConfig;
    readonly integration?: {
        readonly requires?: readonly GoogleMapsIntegrationName[];
    };
}

export type GoogleMapsIntegrationName = 'googleMaps';

export interface RegionMapDataConfig {
    readonly title?: string;
    readonly center: LatLng;
    readonly zoom: number;
    readonly region: Polygon;
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

export interface ResolvedRegionMapConfig {
    readonly data: RegionMapDataConfig;
    readonly integrations: ReactEdgeRuntimeIntegrations;
}