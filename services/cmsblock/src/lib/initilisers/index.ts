import type {Application} from 'express';
import access from '../../access/index';
import routes from '../../routes/index';
import {config} from '../../config';
import {CmsBlockStore} from '../../model/cmsblock/cmsblock-store';
import {setupTelemetry} from '../../observability/tracing';
import {createRequestOperationMiddleware} from '../../observability/request-operation-middleware';

export async function initialiseApp(app: Application): Promise<void> {
    app.locals.cmsblocks = new CmsBlockStore(config.dataDirectory);
    setupTelemetry(app);
    app.use(createRequestOperationMiddleware('cmsblock.request'));
    access(app);
    routes(app);
}
