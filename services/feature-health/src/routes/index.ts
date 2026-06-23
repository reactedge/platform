import {Application} from "express";
import {setupObserveRoutes} from "./observeRouter";

export default (app: Application) => {
    setupObserveRoutes(app)
}