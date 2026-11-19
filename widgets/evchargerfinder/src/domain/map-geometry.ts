import type { ChargingStation, LatLng } from "./ev-charger.types.ts";

export interface StationBounds { readonly minLat: number; readonly maxLat: number; readonly minLng: number; readonly maxLng: number }

export function getStationBounds(stations: readonly ChargingStation[], center: LatLng): StationBounds {
  const bounds = stations.reduce((result, station) => ({
    minLat: Math.min(result.minLat, station.lat), maxLat: Math.max(result.maxLat, station.lat),
    minLng: Math.min(result.minLng, station.lng), maxLng: Math.max(result.maxLng, station.lng),
  }), { minLat: center.lat - 0.05, maxLat: center.lat + 0.05, minLng: center.lng - 0.08, maxLng: center.lng + 0.08 });
  return bounds;
}
