import { z } from "zod";
import { BASE_RADIUS_MI } from "./golf-course.types.ts";
import type { GolfCourse } from "./golf-course.types.ts";

const REQUEST_TIMEOUT_MS = 25_000;

const SearchResponseSchema = z.object({
    postcode: z.string(),
    radius_miles: z.number(),
    total: z.number(),
    courses: z.array(z.object({
        distance_miles: z.number(),
    }).passthrough()),
}).passthrough();

export interface GolfCourseSearchResult {
    readonly postcode: string;
    readonly radius_miles: number;
    readonly total: number;
    readonly courses: GolfCourse[];
}

export class GolfCourseApiError extends Error {}

export class GolfCourseSearchService {
    private readonly apiBaseUrl: string;
    private readonly fetcher: typeof fetch;

    constructor(
        apiBaseUrl: string,
        fetcher: typeof fetch = (...args) => globalThis.fetch(...args),
    ) {
        this.apiBaseUrl = apiBaseUrl;
        this.fetcher = fetcher;
    }

    async search(postcode: string, radiusMiles: number): Promise<GolfCourseSearchResult> {
        const endpoint = new URL("/golfcourses/nearby", this.apiBaseUrl);
        endpoint.searchParams.set("postcode", postcode.trim());
        endpoint.searchParams.set("radius_miles", String(radiusMiles));

        let response: Response;
        try {
            response = await this.fetcher(endpoint.toString(), {
                headers: { Accept: "application/json" },
                signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            });
        } catch (error) {
            if (error instanceof DOMException && error.name === "TimeoutError") {
                throw new GolfCourseApiError("The golf course search timed out. Please try again.");
            }
            throw new GolfCourseApiError("The golf course search service could not be reached.");
        }

        let payload: unknown;
        try {
            payload = await response.json();
        } catch {
            throw new GolfCourseApiError("The golf course search service returned an invalid response.");
        }

        if (!response.ok) {
            const errorMessage = z.object({ error: z.string() }).safeParse(payload);
            throw new GolfCourseApiError(
                errorMessage.success
                    ? errorMessage.data.error
                    : "The golf course search could not be completed.",
            );
        }

        const result = SearchResponseSchema.safeParse(payload);
        if (!result.success) {
            throw new GolfCourseApiError("The golf course search service returned an invalid response.");
        }

        return result.data;
    }

    async checkAvailability(): Promise<boolean> {
        try {
            const endpoint = new URL("/golfcourses/status", this.apiBaseUrl);
            const response = await this.fetcher(endpoint.toString(), {
                headers: { Accept: "application/json" },
                signal: AbortSignal.timeout(5_000),
            });
            if (!response.ok) return false;
            const payload: unknown = await response.json();
            return z.object({ status: z.literal("ok") }).safeParse(payload).success;
        } catch {
            return false;
        }
    }
}

export function getDistanceOptions() {
    return BASE_RADIUS_MI.map(value => ({ label: `${value} miles`, value }));
}

