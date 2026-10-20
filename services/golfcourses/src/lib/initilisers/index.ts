import type {Application} from 'express';
import access from '../../access';
import routes from '../../routes/index.js';
import {setupTelemetry} from '../../observability/tracing';
import {createRequestOperationMiddleware} from '../../observability/request-operation-middleware';
import {findNearbyGolfCourses} from '../../model/golf-course/golf-course-search';
import type {GolfCourseSearchResult} from '../../model/golf-course/golf-course-search';

export type GolfCourseSearch = (postcode: string, radiusMiles: number) => Promise<GolfCourseSearchResult>;

export const initialiseApp = async (
    app: Application,
    searchGolfCourses: GolfCourseSearch = findNearbyGolfCourses,
): Promise<void> => {
    setupTelemetry(app);
    app.locals.searchGolfCourses = searchGolfCourses;
    app.use(createRequestOperationMiddleware('golfcourses.request'));
    access(app);
    routes(app);
};
