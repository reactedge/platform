import type {Application} from 'express';
import {setupTelemetry} from '../observability/tracing';
import {createRequestOperationMiddleware} from '../observability/request-operation-middleware';
import {findNearbyChargers} from '../model/charging-station-search';
import type {ChargingStationSearch} from '../model/charging-station-search';
import {setupRoutes} from '../routes';

export const initialiseApp = async (
    app: Application,
    searchChargers: ChargingStationSearch = findNearbyChargers,
): Promise<void> => {
    setupTelemetry(app);
    app.locals.searchChargers = searchChargers;
    app.use(createRequestOperationMiddleware('evchargerfinder.request'));
    setupRoutes(app);
};
