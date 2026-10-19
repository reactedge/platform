import type {Application} from "express";
import {setupStatusRoutes} from "./status-router";
import {setupBeachRoutes} from "./beach-router";

export default (app: Application) => {
    setupStatusRoutes(app);
    setupBeachRoutes(app);
}
