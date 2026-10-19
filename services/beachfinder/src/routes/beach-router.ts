import type {Application} from 'express';
import express from 'express';
import {config} from '../config';
import {BeachFinder} from '../model/beachfinder/beach-finder';
import {BeachFinderHandler} from '../controller/beachfinder-handler';
import {corsOptions} from '../lib/cors-setup';
import {createRouteOperationMiddleware} from '../observability/request-operation-middleware';

export function setupBeachRoutes(app: Application, finder = new BeachFinder()): void {
    const router = express.Router();
    const handler = new BeachFinderHandler(finder);
    router.use(corsOptions());
    router.get(
        '/beaches',
        createRouteOperationMiddleware('beachfinder.search'),
        handler.search
    );
    app.use(config.route.servicePrefix, router);
}
