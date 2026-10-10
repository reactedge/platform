import {NextFunction, Request, RequestHandler, Response} from "express";
import {sanitiseUrl} from "../lib/url";
import {OpenTelemetryObserver} from "./activity";
import {Operation} from "./operation";

export const createRequestOperationMiddleware = (
    operationName: string
): RequestHandler => (req: Request, res: Response, next: NextFunction): void => {
    const telemetry = req.app.locals.telemetry as OpenTelemetryObserver;
    const operation = telemetry.startOperation(operationName, {
        'http.request.method': req.method,
        'url.path': sanitiseUrl(req.originalUrl)
    });

    res.locals.requestOperation = operation;
    res.once('finish', () => operation.complete(res.statusCode));
    res.once('close', () => {
        if (!res.writableFinished) {
            operation.fail(new Error('Response closed before completion.'));
        }
    });
    next();
};

export const createRouteOperationMiddleware = (
    operationName: string
): RequestHandler => (req: Request, res: Response, next: NextFunction): void => {
    const telemetry = req.app.locals.telemetry as OpenTelemetryObserver;
    const parent = res.locals.requestOperation as Operation;
    res.locals.routeOperation = telemetry.startChildOperation(parent, operationName);
    next();
};
