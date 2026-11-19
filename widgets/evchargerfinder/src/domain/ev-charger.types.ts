export type LatLng = { readonly lat: number; readonly lng: number };

export interface Connector {
  readonly type: string;
  readonly powerKw: number | null;
  readonly quantity: number | null;
}

export interface ChargingStation {
  readonly id: number;
  readonly name: string;
  readonly address: string;
  readonly lat: number;
  readonly lng: number;
  readonly connectors: readonly Connector[];
  readonly available: boolean;
  readonly distanceKm: number;
}

export interface EVChargerFinderDataConfig {
  readonly defaultCenter: LatLng;
  readonly zoom: number;
}

export interface EVChargerFinderConfig {
  readonly data: EVChargerFinderDataConfig;
  readonly integrations: {
    readonly evchargerfinderApi: { readonly api: string };
  };
  readonly translations?: Record<string, string>;
}

export type TranslationsConfig = Record<string, string> | undefined;
export type ReactEdgeRuntimeConfig = { readonly integrations?: Record<string, never> };
export type ReactEdgeRuntimeIntegrations = Record<string, never>;
export type DistanceUnit = "km";
export interface DistanceOption { readonly value: number; readonly label: string }
export const BASE_RADIUS_KM = [5, 10, 25, 50] as const;
