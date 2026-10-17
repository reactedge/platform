import type { GolfCourse, LatLng } from "./golf-course.types.ts";

function readString(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readNumber(value: unknown): number | undefined {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) return parsed;
    }
    return undefined;
}

export function courseName(course: GolfCourse): string {
    return readString(course.name)
        ?? readString(course.club_name)
        ?? readString(course.course_name)
        ?? "Golf course";
}

export function courseLocation(course: GolfCourse): string | undefined {
    return readString(course.postcode)
        ?? readString(course.address)
        ?? readString(course.town)
        ?? readString(course.location);
}

export function courseCoordinates(course: GolfCourse): LatLng | undefined {
    const location = typeof course.location === "object" && course.location !== null
        ? course.location as Record<string, unknown>
        : undefined;
    const coordinates = typeof course.coordinates === "object" && course.coordinates !== null
        ? course.coordinates as Record<string, unknown>
        : undefined;
    const lat = readNumber(course.lat)
        ?? readNumber(course.latitude)
        ?? readNumber(location?.lat)
        ?? readNumber(location?.latitude)
        ?? readNumber(coordinates?.lat)
        ?? readNumber(coordinates?.latitude);
    const lng = readNumber(course.lng)
        ?? readNumber(course.longitude)
        ?? readNumber(location?.lng)
        ?? readNumber(location?.longitude)
        ?? readNumber(coordinates?.lng)
        ?? readNumber(coordinates?.longitude);
    if (lat === undefined || lng === undefined || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return undefined;
    }
    return { lat, lng };
}
