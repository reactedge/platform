import {Request, Response} from "express";
import {Operation} from "../observability/operation";

export class StatusHandler {
    status = async (_req: Request, res: Response): Promise<void> => {
        const operation = res.locals.routeOperation as Operation;

        try {
            operation.succeed();
            res.json({status: 'ok'});
        } catch (error) {
            operation.fail(error);
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
}
