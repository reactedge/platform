import {z} from 'zod';
import {config} from '../config';

const postcodePayloadSchema = z.object({
    result: z.object({latitude: z.number(), longitude: z.number()}).nullable(),
});

const connectionSchema = z.object({
    ConnectionType: z.object({Title: z.string().nullable().optional()}).nullable().optional(),
    PowerKW: z.number().nullable().optional(),
    Quantity: z.number().int().nullable().optional(),
}).passthrough();

const pointSchema = z.object({
    ID: z.number().int(),
    AddressInfo: z.object({
        Title: z.string().nullable().optional(),
        AddressLine1: z.string().nullable().optional(),
        AddressLine2: z.string().nullable().optional(),
        Town: z.string().nullable().optional(),
        StateOrProvince: z.string().nullable().optional(),
        Postcode: z.string().nullable().optional(),
        Latitude: z.number(),
        Longitude: z.number(),
    }).passthrough(),
    Connections: z.array(connectionSchema).nullable().optional(),
    StatusType: z.object({IsOperational: z.boolean().nullable().optional()}).nullable().optional(),
}).passthrough();

const ocmPayloadSchema = z.array(pointSchema);

export type Connector = {type: string; powerKw: number | null; quantity: number | null};
export type ChargingStation = {
    id: number;
    name: string;
    address: string;
    lat: number;
    lng: number;
    connectors: Connector[];
    available: boolean;
    distanceKm: number;
};
export type ChargingStationSearchResult = {
    center: {lat: number; lng: number};
    stations: ChargingStation[];
};
export type ChargingStationSearch = (postcode: string, radiusKm: number) => Promise<ChargingStationSearchResult>;

export class SearchError extends Error {
    constructor(message: string, readonly statusCode: number) {
        super(message);
        this.name = 'SearchError';
    }
}

type SearchOptions = {
    fetcher?: typeof fetch;
    apiKey?: string;
    ocmApiUrl?: string;
    postcodeApiUrl?: string;
};

const REQUEST_TIMEOUT_MS = 10_000;

export async function findNearbyChargers(
    postcodeInput: string,
    radiusKm: number,
    options: SearchOptions = {},
): Promise<ChargingStationSearchResult> {
    const postcode = normalizePostcode(postcodeInput);
    if (!isPlausibleUkPostcode(postcode)) throw new SearchError('Enter a valid UK postcode.', 400);

    const fetcher = options.fetcher ?? fetch;
    const postcodeApiUrl = options.postcodeApiUrl ?? config.postcodeApiUrl;
    const ocmApiUrl = options.ocmApiUrl ?? config.ocmApiUrl;
    const location = await lookupPostcode(postcode, postcodeApiUrl, fetcher);
    const points = await queryOpenChargeMap(location, radiusKm, ocmApiUrl, options.apiKey ?? config.ocmApiKey, fetcher);
    return {center: location, stations: points.map((point) => normalizeStation(point, location))};
}

function normalizePostcode(value: string): string {
    return value.trim().replace(/\s+/g, ' ').toUpperCase();
}

function isPlausibleUkPostcode(postcode: string): boolean {
    return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/.test(postcode);
}

async function lookupPostcode(
    postcode: string,
    baseUrl: string,
    fetcher: typeof fetch,
): Promise<{lat: number; lng: number}> {
    let response: Response;
    try {
        response = await fetcher(`${baseUrl.replace(/\/$/, '')}/postcodes/${encodeURIComponent(postcode)}`, {
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch (error) {
        throw upstreamRequestError(error, 'The postcode lookup service');
    }
    if (response.status === 404) throw new SearchError('The postcode was not recognised.', 400);
    if (!response.ok) throw new SearchError('The postcode lookup service returned an error.', response.status === 429 ? 503 : 502);

    const payload = await parseJson(response, postcodePayloadSchema, 'The postcode lookup service');
    if (!payload.result) throw new SearchError('The postcode was not recognised.', 400);
    return {lat: payload.result.latitude, lng: payload.result.longitude};
}

async function queryOpenChargeMap(
    center: {lat: number; lng: number},
    radiusKm: number,
    apiUrl: string,
    apiKey: string,
    fetcher: typeof fetch,
): Promise<z.infer<typeof pointSchema>[]> {
    const url = new URL(apiUrl);
    url.search = new URLSearchParams({
        latitude: String(center.lat),
        longitude: String(center.lng),
        distance: String(radiusKm),
        distanceunit: 'KM',
        maxresults: '100',
        compact: 'true',
        verbose: 'false',
    }).toString();
    if (apiKey) url.searchParams.set('key', apiKey);

    let response: Response;
    try {
        response = await fetcher(url, {signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)});
    } catch (error) {
        throw upstreamRequestError(error, 'Open Charge Map');
    }
    if (response.status === 429) throw new SearchError('Charging station search is temporarily rate limited.', 503);
    if (!response.ok) throw new SearchError('The charging station provider returned an error.', 502);
    return parseJson(response, ocmPayloadSchema, 'The charging station provider');
}

async function parseJson<T extends z.ZodType>(response: Response, schema: T, provider: string): Promise<z.infer<T>> {
    try {
        return schema.parse(await response.json());
    } catch {
        throw new SearchError(`${provider} returned an invalid response.`, 502);
    }
}

function upstreamRequestError(error: unknown, provider: string): SearchError {
    if (error instanceof Error && error.name === 'TimeoutError') {
        return new SearchError(`${provider} timed out. Please try again.`, 504);
    }
    return new SearchError(`${provider} could not be reached.`, 502);
}

function normalizeStation(
    point: z.infer<typeof pointSchema>,
    center: {lat: number; lng: number},
): ChargingStation {
    const info = point.AddressInfo;
    const address = [info.AddressLine1, info.AddressLine2, info.Town, info.StateOrProvince, info.Postcode]
        .filter((part): part is string => Boolean(part?.trim()))
        .join(', ');
    const connectors = (point.Connections ?? []).map((connection) => ({
        type: connection.ConnectionType?.Title?.trim() || 'Unknown connector',
        powerKw: connection.PowerKW ?? null,
        quantity: connection.Quantity ?? null,
    }));
    return {
        id: point.ID,
        name: info.Title?.trim() || 'Charging station',
        address: address || 'Address unavailable',
        lat: info.Latitude,
        lng: info.Longitude,
        connectors,
        available: point.StatusType?.IsOperational ?? false,
        distanceKm: Math.round(distanceKm(center.lat, center.lng, info.Latitude, info.Longitude) * 10) / 10,
    };
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const radians = (degrees: number) => degrees * Math.PI / 180;
    const latitudeDelta = radians(lat2 - lat1);
    const longitudeDelta = radians(lng2 - lng1);
    const arc = Math.sin(latitudeDelta / 2) ** 2
        + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(longitudeDelta / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));
}
