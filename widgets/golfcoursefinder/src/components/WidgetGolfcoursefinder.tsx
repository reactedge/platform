import { useGolfCourseSearchController } from "../controller/useGolfCourseSearchController.ts";
import type { GolfCourseFinderConfig } from "../domain/golf-course.types.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";
import { GolfCourseMap } from "./GolfCourseListing/Map.tsx";
import { GolfCourseResultsCards } from "./GolfCourseListing/GolfCourseResultsCards.tsx";
import { GolfCourseResultsTable } from "./GolfCourseListing/GolfCourseResultsTable.tsx";
import { GolfCourseSearchForm } from "./GolfCourseListing/GolfCourseSearch.tsx";
import { ErrorState } from "./global/ErrorState.tsx";
import { SpinnerOverlay } from "./global/SpinnerOverlay.tsx";

type Props = { config: GolfCourseFinderConfig };

export function WidgetGolfcoursefinder({ config }: Props) {
    const { t } = useTranslationState();
    const { courses, center, error, loading, apiReachable, handleSearch } = useGolfCourseSearchController(config);

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
