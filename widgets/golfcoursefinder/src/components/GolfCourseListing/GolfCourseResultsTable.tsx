import type { GolfCourse } from "../../domain/golf-course.types.ts";
import { courseLocation, courseName } from "../../domain/golf-course-display.ts";

interface ResultsTableProps {
    readonly courses: readonly GolfCourse[];
}

export function GolfCourseResultsTable({ courses }: ResultsTableProps) {
    if (courses.length === 0) {
        return null;
    }

    return (
        <details className="golfCourseTable">
            <summary className="golfCourseTable__summary">View results as a table</summary>
            <div className="golfCourseTable__scroll">
                <table className="golfCourseTable__table">
                    <thead>
                        <tr className="golfCourseTable__headRow">
                            <th className="golfCourseTable__th" scope="col">Course</th>
                            <th className="golfCourseTable__th" scope="col">Location</th>
                            <th className="golfCourseTable__th" scope="col">Distance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, index) => (
                            <tr className="golfCourseTable__row" key={`${courseName(course)}-${index}`}>
                                <td className="golfCourseTable__td">{courseName(course)}</td>
                                <td className="golfCourseTable__td">{courseLocation(course) ?? "—"}</td>
                                <td className="golfCourseTable__td">{course.distance_miles.toFixed(1)} miles</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </details>
    );
}
