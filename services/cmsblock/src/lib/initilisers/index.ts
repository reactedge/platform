import type {Application} from 'express';
import access from '../../access/index';
import routes from '../../routes/index';
import {config} from '../../config';
import {CmsBlockStore} from '../../model/cmsblock/cmsblock-store';
import {createOpenAiGenerator} from '../../model/cmsblock/ai-generator';
import {setupTelemetry} from '../../observability/tracing';
import {createRequestOperationMiddleware} from '../../observability/request-operation-middleware';

export async function initialiseApp(app: Application): Promise<void> {
    const provider = config.generation.provider;
    if (provider !== 'deterministic' && provider !== 'openai') {
        throw new Error('CMSBLOCK_GENERATOR must be deterministic or openai.');
    }
    if (provider === 'openai' && !config.generation.apiKey) {
        throw new Error('OPENAI_API_KEY is required when CMSBLOCK_GENERATOR=openai.');
    }
    const ai = provider === 'openai'
        ? createOpenAiGenerator({
            apiKey: config.generation.apiKey,
            model: config.generation.model,
            promptVersion: config.generation.promptVersion,
            promptUrl: config.generation.promptUrl,
        })
        : undefined;
    app.locals.cmsblocks = new CmsBlockStore(config.dataDirectory, ai);
    setupTelemetry(app);
    app.use(createRequestOperationMiddleware('cmsblock.request'));
    access(app);
    routes(app);
}
