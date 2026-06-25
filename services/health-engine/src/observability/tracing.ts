import {Application} from "express";
import {OpenTelemetryObserver} from "./activity";

export function setupTelemetry(app: Application) {
    app.locals.telemetry = new OpenTelemetryObserver();
}