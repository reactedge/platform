import express from 'express';
import type {Application} from 'express';
import {config} from '../config';
import {CmsBlockHandler} from '../controller/cmsblock-handler';
import {corsOptions} from '../lib/cors-setup';
import {createRouteOperationMiddleware} from '../observability/request-operation-middleware';

export function setupCmsBlockRoutes(app: Application): void {
    const router = express.Router();
    const handler = new CmsBlockHandler();
    router.use(corsOptions());
    router.use((_req, res, next) => {
        res.setHeader('Cache-Control', 'no-store');
        next();
    });
    router.get('/blocks/demo', createRouteOperationMiddleware('cmsblock.get'), handler.get);
    router.put('/blocks/demo', createRouteOperationMiddleware('cmsblock.save'), handler.save);
    router.post('/blocks/demo/generate', createRouteOperationMiddleware('cmsblock.generate'), handler.generate);
    router.post('/blocks/demo/approve', createRouteOperationMiddleware('cmsblock.approve'), handler.approve);
    router.post('/blocks/demo/reject', createRouteOperationMiddleware('cmsblock.reject'), handler.reject);
    app.use(config.route.servicePrefix, router);
}
