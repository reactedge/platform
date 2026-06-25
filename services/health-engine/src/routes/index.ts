import {Application} from "express";
import {setupHealthValidationRoutes} from "./healthValidationRouter";

export default (app: Application) => {
    setupHealthValidationRoutes(app)
}