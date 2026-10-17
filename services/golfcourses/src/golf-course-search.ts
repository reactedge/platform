import {z} from 'zod';
import {config} from './config';

const postcodeResultSchema = z.object({
    result: z.object({
        postcode: z.string(),
        latitude: z.number(),
        longitude: z.number(),
    }).nullable(),
});

const golfResponseSchema = z.object({
    data: z.array(z.object({distance_km: z.number()}).passthrough()),
    meta: z.record(z.string(), z.unknown()).optional(),
});

export class SearchError extends Error {
    constructor(message: string, readonly statusCode: number) {
        super(message);
        this.name = 'SearchError';
    }
}

export type GolfCourseSearchResult = {
    postcode: string;
    radius_miles: number;
    total: number;
    courses: Array<Record<string, unknown> & {distance_miles: number}>;
};

type SearchOptions = {
    fetcher?: typeof fetch;
    rapidApiKey?: string;
    golfApiUrl?: string;
    postcodeApiUrl?: string;
};

const MILES_TO_KM = 1.609344;
const REQUEST_TIMEOUT_MS = 10_000;

export async function findNearbyGolfCourses(
    postcodeInput: string,
    radiusMiles: number,
    options: SearchOptions = {},
): Promise<GolfCourseSearchResult> {
    const postcode = postcodeInput.trim().replace(/\s+/g, ' ').toUpperCase();
    if (!postcode) throw new SearchError('A UK postcode is required.', 400);

    const rapidApiKey = options.rapidApiKey ?? config.rapidApiKey;
    if (!rapidApiKey) {
        throw new SearchError('Golf course search is not configured: RAPIDAPI_KEY is missing.', 503);
    }

    const fetcher = options.fetcher ?? fetch;
    const postcodeApiUrl = options.postcodeApiUrl ?? config.postcodeApiUrl;
    const golfApiUrl = options.golfApiUrl ?? config.golfApiUrl;
    let postcodeResponse: Response;
    try {
        postcodeResponse = await fetcher(
            `${postcodeApiUrl}/postcodes/${encodeURIComponent(postcode)}`,
            {signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)},
        );
    } catch {
        throw new SearchError('The postcode lookup service could not be reached.', 502);
    }
    if (!postcodeResponse.ok) {
        if (postcodeResponse.status === 404) throw new SearchError('The postcode was not recognised.', 400);
        throw new SearchError('The postcode lookup service returned an error.', 502);
    }

    let postcodePayload: z.infer<typeof postcodeResultSchema>;
    try {
        postcodePayload = postcodeResultSchema.parse(await postcodeResponse.json());
    } catch {
        throw new SearchError('The postcode lookup service returned an invalid response.', 502);
    }
    const location = postcodePayload.result;
    if (!location) throw new SearchError('The postcode was not recognised.', 400);

    let golfResponse: Response;
    try {
        const query = new URLSearchParams({
            lat: String(location.latitude),
            lng: String(location.longitude),
            radius_km: String(radiusMiles * MILES_TO_KM),
            limit: '50',
        });
        golfResponse = await fetcher(`${golfApiUrl}/clubs/nearby?${query}`, {
            headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'uk-golf-course-data-api.p.rapidapi.com',
            },
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch {
        throw new SearchError('The golf course API could not be reached.', 502);
    }
    if (golfResponse.status === 429) {
        throw new SearchError('The golf course API rate limit has been reached. Please try again shortly.', 503);
    }
    if (golfResponse.status === 401 || golfResponse.status === 403) {
        throw new SearchError('The golf course API rejected its configured credentials.', 502);
    }
    if (!golfResponse.ok) throw new SearchError('The golf course API returned an error.', 502);

    let golfPayload: z.infer<typeof golfResponseSchema>;
    try {
        golfPayload = golfResponseSchema.parse(await golfResponse.json());
    } catch {
        throw new SearchError('The golf course API returned an invalid response.', 502);
    }

    const courses = golfPayload.data.map((course) => ({
        ...course,
        distance_miles: Math.round((course.distance_km / MILES_TO_KM) * 10) / 10,
    }));
    return {
        postcode: location.postcode,
        radius_miles: radiusMiles,
        total: Number(golfPayload.meta?.total ?? courses.length),
        courses,
    };
}
