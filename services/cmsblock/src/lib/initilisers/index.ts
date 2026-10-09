import {Application} from "express";
import access from "../../access/index"
import routes from "../../routes/index.js";
import {setupTelemetry} from "../../observability/tracing";
import {createRequestOperationMiddleware} from "../../observability/request-operation-middleware";

export const initialiseApp = async (app: Application) => {
    setupTelemetry(app)
    app.use(createRequestOperationMiddleware('cmsblock.request'))
    access(app)
    routes(app)
}
