import express from 'express';
import type {Application} from 'express';
import {config} from '../config';
import {ProductHandler} from '../controller/product-handler';
import {corsOptions} from '../lib/cors-setup';
import {createRouteOperationMiddleware} from '../observability/request-operation-middleware';

export const setupProductRoutes = (app: Application): void => {
    const router = express.Router();
    const handler = new ProductHandler();

    router.use(corsOptions());
    router.use((_req, res, next) => {
        res.setHeader('Cache-Control', 'no-store');
        next();
    });
    router.get('/products', createRouteOperationMiddleware('listingrecord.product.list'), handler.list);
    router.post('/products', createRouteOperationMiddleware('listingrecord.product.create'), handler.create);
    router.put('/products/:id', createRouteOperationMiddleware('listingrecord.product.update'), handler.update);
    router.delete('/products/:id', createRouteOperationMiddleware('listingrecord.product.delete'), handler.delete);

    app.use(config.route.servicePrefix, router);
};
