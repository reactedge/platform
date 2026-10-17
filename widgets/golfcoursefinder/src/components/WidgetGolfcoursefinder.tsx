import { useMemo, useState } from "react";
import { MapSearch } from "../Model/MapSearch.ts";
import { useSystemState } from "../state/System/useSystemState.ts";
import type { GolfCourse, GolfCourseFinderConfig, LatLng } from "../domain/golf-course.types.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";
import { GolfCourseMap } from "./GolfCourseListing/Map.tsx";
import { GolfCourseResultsCards } from "./GolfCourseListing/GolfCourseResultsCards.tsx";
import { GolfCourseResultsTable } from "./GolfCourseListing/GolfCourseResultsTable.tsx";
import { GolfCourseSearchForm } from "./GolfCourseListing/GolfCourseSearch.tsx";
import { ErrorState } from "./global/ErrorState.tsx";
import { SpinnerOverlay } from "./global/SpinnerOverlay.tsx";

type Props = { config: GolfCourseFinderConfig };

export function WidgetGolfcoursefinder({ config }: Props) {
    const mapSearch = useMemo(() => new MapSearch(), []);
    const { golfCourseSearch, apiReachable } = useSystemState();
    const [courses, setCourses] = useState<GolfCourse[]>([]);
    const [center, setCenter] = useState<LatLng>(config.data.defaultCenter);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslationState();

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

    return (
        <section className="golfCourseFinder" aria-label={t("Golf course finder")}>
            <h1 data-golf-course-title>{t(config.data.title)}</h1>
            <GolfCourseSearchForm onSearch={handleSearch} />
            {loading && <SpinnerOverlay />}
            {error && <ErrorState message={error} />}
            {!error && apiReachable === false && <ErrorState message={t("The golf course search service could not be reached.")} />}
            <GolfCourseMap
                courses={courses}
                currentCenter={center}
                config={config}
            />
            <GolfCourseResultsCards courses={courses} />
            <GolfCourseResultsTable courses={courses} />
        </section>
    );
}
