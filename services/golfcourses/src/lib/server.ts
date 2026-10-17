import express, {type Application} from 'express';
import {config} from '../config';
import {initialiseApp} from './initilisers';
import type {OpenTelemetryObserver} from '../observability/activity';

export const startServer = async (): Promise<void> => {
    const app: Application = express();
    const port = config.port;

    await initialiseApp(app);
    const telemetry = app.locals.telemetry as OpenTelemetryObserver;

    try {
        await new Promise<void>((resolve, reject) => {
            const server = app.listen(port, (error?: Error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
            server.once('error', reject);
        });
        telemetry.logObservation('golfcourses.server.started', {'server.port': port});
    } catch (error) {
        const operation = telemetry.startOperation('golfcourses.server.failed', {'server.port': port});
        operation.fail(error);
        throw error;
    }
};
