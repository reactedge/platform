import {
    BASE_RADIUS_KM, BASE_RADIUS_MI,
    type DistanceOption,
    type LatLng,
    type Store,
    type StoreFinderDataConfig,
    type StoreWithDistance
} from "./store.types";
import { MapSearch } from "../Model/MapSearch";

const KM_TO_MI = 0.621371;
const MI_TO_KM = 1 / KM_TO_MI; // avoids rounding mismatch

export interface StoreSearchResult {
    readonly stores: readonly StoreWithDistance[];
    readonly center: LatLng;
}

export class StoreSearchService {
    private readonly dataset: StoreFinderDataConfig;
    private readonly mapSearch: MapSearch;

    constructor(dataset: StoreFinderDataConfig, mapSearch: MapSearch) {
        this.dataset = dataset;
        this.mapSearch = mapSearch;
    }

    async search(
        postcode: string,
        radius: number,
        countryCode: string
    ): Promise<StoreSearchResult | null> {

        const userLocation = await this.mapSearch.geocodePostcode(postcode, countryCode);
        if (!userLocation) return null;

        const unit = countryCode.toLowerCase() === 'gb' ? 'mi' : 'km';

        const maxDistanceKm =
            unit === 'mi'
                ? radius * MI_TO_KM
                : radius;

        const stores: StoreWithDistance[] = this.dataset.stores
            .map((store: Store) => ({
                ...store,
                distance: this.mapSearch.calculateDistanceKm(
                    userLocation.lat,
                    userLocation.lng,
                    store.lat,
                    store.lng
                )
            }))
            .filter(store => store.distance <= maxDistanceKm)
            .sort((a, b) => a.distance - b.distance);

        return {
            stores,
            center: userLocation
        };
    }
}

export function getDistanceOptions(countryCode: string): DistanceOption[] {
    const isGb = countryCode.toLowerCase() === 'gb';
    const unit = isGb ? 'mi' : 'km';
    const options = isGb ? BASE_RADIUS_MI : BASE_RADIUS_KM;

    return options.map((distance) => ({
        value: distance,
        label: `${distance} ${unit}`
    }));
}

export function getUnitLabel(countryCode: string) {
    const isGb = countryCode.toLowerCase() === 'gb';
    return isGb ? 'miles' : 'km';
}