import express, { Application, Request, Response, NextFunction } from 'express'
import { config } from "../config";
import { corsOptions } from '../lib/cors-setup'
import {sanitiseUrl} from "../lib/url";
import {ObserveHandler} from "../controller/observe-handler"

export const setupObserveRoutes = (app: Application) => {
    const router = express.Router()
    const options = corsOptions();
    router.use(options)

    const observeHandlerController = new ObserveHandler()

    router.use('/', (req: Request, res: Response, next: NextFunction) => {
        console.log(`observe request: ${sanitiseUrl(req.url)}`)
        next()
    })

    router.post("/", observeHandlerController.validateFeatures)

    app.use(config.route.observePrefix, router)
}