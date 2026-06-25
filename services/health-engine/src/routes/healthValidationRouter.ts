import express, { Application, Request, Response, NextFunction } from 'express'
import { config } from "../config";
import { corsOptions } from '../lib/cors-setup'
import { sanitiseUrl } from "../lib/url";
import { HealthValidationHandler } from "../controller/health-validation-handler"

export const setupHealthValidationRoutes = (app: Application) => {
    const router = express.Router()
    const options = corsOptions();
    router.use(options)

    const healthValidationHandlerController = new HealthValidationHandler()

    router.use('/', (req: Request, res: Response, next: NextFunction) => {
        console.log(`health validation request: ${sanitiseUrl(req.url)}`)
        next()
    })

    router.post("/widgets", healthValidationHandlerController.validateFeatures)

    router.post("/performance", healthValidationHandlerController.validatPerformance)

    app.use(config.route.validationPrefix, router)
}