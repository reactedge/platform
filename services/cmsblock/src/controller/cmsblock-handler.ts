import type {Request, Response} from 'express';
import {CmsBlockValidationError, CmsBlockWorkflowError} from '../model/cmsblock/errors';
import type {CmsBlockStore} from '../model/cmsblock/cmsblock-store';
import type {Operation} from '../observability/operation';

export class CmsBlockHandler {
    private store(res: Response): CmsBlockStore {
        return res.app.locals.cmsblocks as CmsBlockStore;
    }

    private async handle(res: Response, run: () => Promise<unknown>): Promise<void> {
        const operation = res.locals.routeOperation as Operation;
        try {
            const result = await run();
            if (result === null) {
                operation.complete(404);
                res.status(404).json({error: 'Block not created yet.'});
                return;
            }
            operation.succeed();
            res.json(result);
        } catch (error) {
            operation.fail(error);
            const invalid = error instanceof CmsBlockValidationError ||
                error instanceof CmsBlockWorkflowError;
            res.status(invalid ? 400 : 500).json({
                error: error instanceof Error ? error.message : 'CMSBlock operation failed.',
            });
        }
    }

    get = (_req: Request, res: Response): Promise<void> =>
        this.handle(res, () => this.store(res).get());

    save = (req: Request, res: Response): Promise<void> =>
        this.handle(res, () => this.store(res).save(req.body));

    generate = (_req: Request, res: Response): Promise<void> =>
        this.handle(res, () => this.store(res).generate());

    updatePending = (req: Request, res: Response): Promise<void> =>
        this.handle(res, () => this.store(res).updatePending(req.body));

    approve = (_req: Request, res: Response): Promise<void> =>
        this.handle(res, () => this.store(res).approve());

    reject = (_req: Request, res: Response): Promise<void> =>
        this.handle(res, () => this.store(res).reject());
}
