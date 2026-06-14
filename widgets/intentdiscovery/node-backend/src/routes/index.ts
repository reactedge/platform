import {setupIntentRoutes} from "./intentRouter"
import {Application} from "express";

export default (app: Application) => {
    setupIntentRoutes(app)
}