import express, { Application, Request, Response, NextFunction } from 'express'
import { config } from "../config";
import { corsOptions } from '../lib/cors-setup'
import { sanitiseUrl } from "../lib/url";
import { ValidationHandler } from "../controller/validation-handler"

export const setupValidationRoutes = (app: Application) => {
    const router = express.Router()
    const options = corsOptions();
    router.use(options)

    const ValidationController = new ValidationHandler()

    router.use('/', (req: Request, res: Response, next: NextFunction) => {
        console.log(`health validation request: ${sanitiseUrl(req.url)}`)
        next()
    })

    router.post("/widgets", ValidationController.validateFeatures)

    router.post("/performance", ValidationController.validatPerformance)

    router.get("/status", ValidationController.validatPlatformStatus)

    app.use(config.route.validationPrefix, router)
}