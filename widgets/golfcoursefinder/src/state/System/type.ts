import type { GolfCourseSearchService } from "../../domain/golf-course-search.service.ts";

export interface SystemState {
    readonly golfCourseSearch: GolfCourseSearchService;
    readonly apiReachable: boolean | null;
}
