import {config} from '../../config';

export type Beach = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    distanceMiles: number;
};

type Coordinates = {latitude: number; longitude: number};
type PostcodeResponse = {status: number; result?: {latitude: number; longitude: number}};
type OverpassElement = {
    type: string;
    id: number;
    lat?: number;
    lon?: number;
    center?: {lat: number; lon: number};
    tags?: {name?: string};
};

export class BeachFinder {
    constructor(
        private readonly fetcher: typeof fetch = fetch,
        private readonly postcodeApiUrl = config.providers.postcodeApiUrl,
        private readonly overpassApiUrl = config.providers.overpassApiUrl
    ) {}

    async search(postcode: string, radiusMiles: number): Promise<Beach[]> {
        const origin = await this.lookupPostcode(postcode);
        const elements = await this.lookupBeaches(origin, radiusMiles);
        return elements.map(element => this.toBeach(element, origin))
            .filter((beach): beach is Beach => beach !== null)
            .filter(beach => beach.distanceMiles <= radiusMiles)
            .sort((left, right) => left.distanceMiles - right.distanceMiles);
    }

    private async lookupPostcode(postcode: string): Promise<Coordinates> {
        const response = await this.fetcher(
            `${this.postcodeApiUrl}/${encodeURIComponent(postcode.replace(/\s+/g, ' ').trim())}`
        );
        if (response.status === 404) throw new PostcodeNotFoundError();
        if (!response.ok) throw new ProviderError('Postcode lookup failed.');
        const payload = await response.json() as PostcodeResponse;
        if (!payload.result) throw new PostcodeNotFoundError();
        return {latitude: payload.result.latitude, longitude: payload.result.longitude};
    }

    private async lookupBeaches(origin: Coordinates, radiusMiles: number): Promise<OverpassElement[]> {
        const radiusMeters = Math.round(radiusMiles * 1609.344);
        const query = `[out:json][timeout:20];(node["natural"="beach"](around:${radiusMeters},${origin.latitude},${origin.longitude});way["natural"="beach"](around:${radiusMeters},${origin.latitude},${origin.longitude}););out center tags;`;
        const response = await this.fetcher(this.overpassApiUrl, {
            method: 'POST',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({data: query})
        });
        if (!response.ok) throw new ProviderError('Beach search failed.');
        const payload = await response.json() as {elements?: OverpassElement[]};
        return payload.elements ?? [];
    }

    private toBeach(element: OverpassElement, origin: Coordinates): Beach | null {
        const latitude = element.lat ?? element.center?.lat;
        const longitude = element.lon ?? element.center?.lon;
        if (latitude === undefined || longitude === undefined) return null;
        return {
            id: `${element.type}/${element.id}`,
            name: element.tags?.name ?? 'Unnamed beach',
            latitude,
            longitude,
            distanceMiles: Math.round(distanceMiles(origin, {latitude, longitude}) * 10) / 10
        };
    }
}

export class PostcodeNotFoundError extends Error {}
export class ProviderError extends Error {}

function distanceMiles(from: Coordinates, to: Coordinates): number {
    const radians = (degrees: number) => degrees * Math.PI / 180;
    const latitudeDelta = radians(to.latitude - from.latitude);
    const longitudeDelta = radians(to.longitude - from.longitude);
    const haversine = Math.sin(latitudeDelta / 2) ** 2
        + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude))
        * Math.sin(longitudeDelta / 2) ** 2;
    return 3958.7613 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}
