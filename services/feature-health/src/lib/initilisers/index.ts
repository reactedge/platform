import routes from "../../routes/index.js";
import access from "../../access/index"
import { Application } from "express";
import { setupTelemetry } from "../../observability/tracing";

export const initialiseApp = async (app: Application) => {
    access(app)
    routes(app)
    setupTelemetry(app)
}