import type {Application, ErrorRequestHandler} from 'express';

export const setupErrorHandler = (app: Application): void => {
    const handler: ErrorRequestHandler = (error, _req, res, next) => {
        if (res.headersSent) { next(error); return; }
        const status = error.type === 'entity.too.large' ? 413 : error.type === 'entity.parse.failed' ? 400 : 500;
        res.status(status).json({error: status === 413 ? 'Request too large.' : status === 400 ? 'Invalid JSON.' : 'Listing service error.'});
    };
    app.use(handler);
};
