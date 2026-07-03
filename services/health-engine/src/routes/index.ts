import {Application} from "express";
import {setupValidationRoutes} from "./validationRouter";

export default (app: Application) => {
    setupValidationRoutes(app)
}