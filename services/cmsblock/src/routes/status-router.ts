import express, {Application} from 'express'
import {config} from "../config";
import {StatusHandler} from "../controller/status-handler"
import {corsOptions} from '../lib/cors-setup'
import {createRouteOperationMiddleware} from "../observability/request-operation-middleware";

export const setupStatusRoutes = (app: Application) => {
    const router = express.Router()
    router.use(corsOptions())

    const statusHandler = new StatusHandler()
    router.get(
        "/status",
        createRouteOperationMiddleware('cmsblock.status'),
        statusHandler.status
    )

    app.use(config.route.servicePrefix, router)
}
