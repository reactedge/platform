import express, {type Application} from 'express';
import {config} from '../config';
import {GolfCourseHandler} from '../controller/golf-course-handler';
import {corsOptions} from '../lib/cors-setup';
import {createRouteOperationMiddleware} from '../observability/request-operation-middleware';

export const setupGolfCourseRoutes = (app: Application): void => {
    const router = express.Router();
    const handler = new GolfCourseHandler();
    router.use(corsOptions());
    router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
    router.get(
        '/nearby',
        createRouteOperationMiddleware('golfcourses.nearby'),
        handler.nearby,
    );
    app.use(config.route.servicePrefix, router);
};
