import { z } from "zod";

const BeachSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    distanceMiles: z.number().nonnegative(),
}).strict();

const SearchResponseSchema = z.object({
    postcode: z.string(),
    radiusMiles: z.number().positive(),
    beaches: z.array(BeachSchema),
}).strict();

export type Beach = z.infer<typeof BeachSchema>;
export type BeachSearchResponse = z.infer<typeof SearchResponseSchema>;

export class BeachFinderApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "BeachFinderApiError";
        this.status = status;
    }
}

export interface BeachFinderApiClient {
    search(postcode: string, radiusMiles: number, signal?: AbortSignal): Promise<BeachSearchResponse>;
}

type FetchLike = typeof fetch;

export function createBeachFinderApiClient(
    apiUrl: string,
    fetcher: FetchLike = fetch
): BeachFinderApiClient {
    const endpoint = `${apiUrl.replace(/\/+$/, "")}/beachfinder/beaches`;
    return {
        async search(postcode, radiusMiles, signal) {
            const url = new URL(endpoint);
            url.searchParams.set("postcode", postcode.trim());
            url.searchParams.set("radiusMiles", String(radiusMiles));

            let response: Response;
            try {
                response = await fetcher(url, {
                    method: "GET",
                    ...(signal ? { signal } : {}),
                    headers: { Accept: "application/json" },
                });
            } catch (error) {
                if (signal?.aborted) throw error;
                throw new BeachFinderApiError(0, "The beach search service could not be reached.");
            }

            if (!response.ok) {
                const message = response.status === 400
                    ? "Enter a valid UK postcode and a radius up to 100 miles."
                    : response.status === 404
                        ? "That postcode could not be found. Check it and try again."
                        : "Beach search is temporarily unavailable. Please try again.";
                throw new BeachFinderApiError(response.status, message);
            }

            let payload: unknown;
            try {
                payload = await response.json();
            } catch {
                throw new BeachFinderApiError(502, "The beach search service returned an invalid response.");
            }
            const parsed = SearchResponseSchema.safeParse(payload);
            if (!parsed.success) {
                throw new BeachFinderApiError(502, "The beach search service returned an invalid response.");
            }
            return parsed.data;
        },
    };
}
