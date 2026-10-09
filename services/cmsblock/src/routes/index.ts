import {Application} from "express";
import {setupStatusRoutes} from "./status-router";

export default (app: Application) => {
    setupStatusRoutes(app)
}
