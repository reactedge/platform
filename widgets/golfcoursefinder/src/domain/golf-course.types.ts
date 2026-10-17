export interface LatLng {
    readonly lat: number;
    readonly lng: number;
}

export interface GolfCourse {
    readonly distance_miles: number;
    readonly [key: string]: unknown;
}

export interface GolfCourseFinderConfig {
    readonly data: {
        readonly title: string;
        readonly defaultCenter: LatLng;
        readonly zoom: number;
        readonly country: string;
    };
    readonly integrations: {
        readonly golfcoursesApi: { readonly api: string };
        readonly googleMaps?: { readonly apiKey: string };
    };
    readonly translations?: Record<string, string>;
}

export const BASE_RADIUS_MI = [5, 10, 25, 50] as const;
