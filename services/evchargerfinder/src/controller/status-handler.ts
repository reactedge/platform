import type {Request, Response} from 'express';
import type {Operation} from '../observability/operation';

export class StatusHandler {
    status = (_req: Request, res: Response): void => {
        const operation = res.locals.routeOperation as Operation;
        operation.succeed();
        res.json({status: 'ok'});
    };
}
