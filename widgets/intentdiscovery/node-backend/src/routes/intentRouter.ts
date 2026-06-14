import express, { Application, Request, Response, NextFunction } from 'express'
import { config } from "../config";
import { corsOptions } from '../lib/cors-setup'
import {sanitiseUrl} from "../lib/url";
import {IntentHandler} from "../controller/intent-handler";

export const setupIntentRoutes = (app: Application) => {
    const router = express.Router()
    const options = corsOptions();
    router.use(options)

    const intentHandlerController = new IntentHandler()

    router.use('/', (req: Request, res: Response, next: NextFunction) => {
        console.log(`intent request: ${sanitiseUrl(req.url)}`)
        next()
    })

    router.post("/suggest", intentHandlerController.buildContextSuggestion)

    router.post("/interpret", intentHandlerController.getFiltersFromIntent)

    router.post("/dummy", intentHandlerController.dummy)

    router.options('*', options);

    app.use(config.route.intentPrefix, router)
}