import express from 'express';
import type {Application} from 'express';
import {config} from '../config';
import {ListingHandler} from '../controller/listing-handler';
import {corsOptions} from '../lib/cors-setup';
import {createRouteOperationMiddleware} from '../observability/request-operation-middleware';

export const setupListingRoutes = (app: Application): void => {
    const router = express.Router();
    const handler = new ListingHandler();
    router.use(corsOptions());
    router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
    router.get('/listings', createRouteOperationMiddleware('listingrecord.list'), handler.list);
    router.post('/listings', createRouteOperationMiddleware('listingrecord.create'), handler.create);
    app.use(config.route.servicePrefix, router);
};
