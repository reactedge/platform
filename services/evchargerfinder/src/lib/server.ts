import express, {type Application} from 'express';
import {config} from '../config';
import {initialiseApp} from './setup';
import type {OpenTelemetryObserver} from '../observability/activity';

export const startServer = async (): Promise<void> => {
    const app: Application = express();
    await initialiseApp(app);
    const telemetry = app.locals.telemetry as OpenTelemetryObserver;

    await new Promise<void>((resolve, reject) => {
        const server = app.listen(config.port, () => resolve());
        server.once('error', reject);
    });
    telemetry.logObservation('evchargerfinder.server.started', {'server.port': config.port});
};
