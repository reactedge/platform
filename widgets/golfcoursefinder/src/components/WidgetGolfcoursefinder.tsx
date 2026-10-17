import { useMemo, useState } from "react";
import { MapSearch } from "../Model/MapSearch.ts";
import { GolfCourseSearchService } from "../domain/golf-course-search.service.ts";
import type { GolfCourse, GolfCourseFinderConfig, LatLng } from "../domain/golf-course.types.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";
import { GolfCourseMap } from "./GolfCourseListing/Map.tsx";
import { GolfCourseResultsCards } from "./GolfCourseListing/GolfCourseResultsCards.tsx";
import { GolfCourseSearchForm } from "./GolfCourseListing/GolfCourseSearch.tsx";
import { ErrorState } from "./global/ErrorState.tsx";
import { SpinnerOverlay } from "./global/SpinnerOverlay.tsx";

type Props = { config: GolfCourseFinderConfig };

export function WidgetGolfcoursefinder({ config }: Props) {
    const mapSearch = useMemo(() => new MapSearch(), []);
    const searchService = useMemo(
        () => new GolfCourseSearchService(config.integrations.golfcoursesApi.api),
        [config.integrations.golfcoursesApi.api],
    );
    const [courses, setCourses] = useState<GolfCourse[]>([]);
    const [center, setCenter] = useState<LatLng>(config.data.defaultCenter);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslationState();

    const handleSearch = async (postcode: string, radiusMiles: number) => {
        setError(null);
        setLoading(true);
        try {
            const result = await searchService.search(postcode, radiusMiles);
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
            <GolfCourseMap
                courses={courses}
                currentCenter={center}
                config={config}
            />
            <GolfCourseResultsCards courses={courses} />
        </section>
    );
}
