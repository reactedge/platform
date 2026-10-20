import type { GolfCourse } from "../../domain/golf-course.types.ts";
import { courseLocation, courseName } from "../../domain/golf-course-display.ts";

interface ResultsProps {
    readonly courses: readonly GolfCourse[];
}

export function GolfCourseResultsCards({ courses }: ResultsProps) {
    if (courses.length === 0) {
        return <p className="golfCourseResults__empty">No golf courses found in this radius.</p>;
    }

    return (
        <div className="golfCourseResults" aria-live="polite">
            {courses.map((course, index) => (
                <article
                    key={`${courseName(course)}-${index}`}
                    className="golfCourseCard"
                    data-golf-course-card
                >
                    <div className="golfCourseCard__header">
                        <h3 className="golfCourseCard__title">{courseName(course)}</h3>
                    </div>
                    <div className="golfCourseCard__body">
                        {courseLocation(course) && (
                            <p className="golfCourseCard__line">{courseLocation(course)}</p>
                        )}
                        <p className="golfCourseCard__distance">
                            Distance: {course.distance_miles.toFixed(1)} miles
                        </p>
                    </div>
                </article>
            ))}
        </div>
    );
}
