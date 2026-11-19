import type {Application} from 'express';
import express from 'express';
import {config} from '../config';
import {ChargingStationHandler} from '../controller/charging-station-handler';
import {StatusHandler} from '../controller/status-handler';
import {corsOptions} from '../lib/cors';
import {createRouteOperationMiddleware} from '../observability/request-operation-middleware';

export const setupRoutes = (app: Application): void => {
    const router = express.Router();
    const handler = new ChargingStationHandler();
    router.use(corsOptions());
    router.get('/status', createRouteOperationMiddleware('evchargerfinder.status'), new StatusHandler().status);
    router.get('/nearby', createRouteOperationMiddleware('evchargerfinder.nearby'), handler.nearby);
    app.use(config.routePrefix, router);
};
