import express from 'express';
import type {Application} from 'express';
import {config} from '../config';
import {ProductImageHandler} from '../controller/product-image-handler';
import {corsOptions} from '../lib/cors-setup';
import {createRouteOperationMiddleware} from '../observability/request-operation-middleware';

export const setupProductImageRoutes = (app: Application): void => {
    const router = express.Router();
    const handler = new ProductImageHandler();

    router.use(corsOptions());
    router.post('/product-images/signature',
        createRouteOperationMiddleware('listingrecord.product_image.signature'),
        handler.signature);

    app.use(config.route.servicePrefix, router);
};
