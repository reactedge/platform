import { useMemo, useState } from "react";
import { MapSearch } from "../Model/MapSearch.ts";
import { useSystemState } from "../state/System/useSystemState.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";
import type { GolfCourse, GolfCourseFinderConfig, LatLng } from "../domain/golf-course.types.ts";

export function useGolfCourseSearchController(config: GolfCourseFinderConfig) {
    const { t } = useTranslationState();
    const mapSearch = useMemo(() => new MapSearch(), []);
    const { golfCourseSearch, apiReachable } = useSystemState();
    const [courses, setCourses] = useState<GolfCourse[]>([]);
    const [center, setCenter] = useState<LatLng>(config.data.defaultCenter);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (postcode: string, radiusMiles: number) => {
        setError(null);
        setLoading(true);
        try {
            const result = await golfCourseSearch.search(postcode, radiusMiles);
            setCourses(result.courses);
            if (config.integrations.googleMaps?.apiKey) {
                try {
                    const mapCenter = await mapSearch.geocodePostcode(postcode, config.data.country);
                    if (mapCenter) setCenter(mapCenter);
                } catch {
                    // The backend search still succeeds if Google Maps geocoding is unavailable.
                }
            }
        } catch (searchError) {
            setError(searchError instanceof Error
                ? searchError.message
                : t("The golf course search could not be completed."));
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    return { courses, center, error, loading, apiReachable, handleSearch };
}
