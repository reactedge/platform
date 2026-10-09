import express, {Application} from 'express'
import {config} from "../config";
import {initialiseApp} from "./initilisers";
import {OpenTelemetryObserver} from "../observability/activity";

export const startServer = async () => {
    const app: Application = express()
    const port = config.port

    await initialiseApp(app)
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
        telemetry.logObservation('cmsblock.server.started', {
            'server.port': port
        });
    } catch (error) {
        const operation = telemetry.startOperation(
            'cmsblock.server.failed',
            {'server.port': port}
        );
        operation.fail(error);
        throw error;
    }
}
