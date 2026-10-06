import {setupListingRoutes} from "./listing-router";
import type {Application} from "express";
import {setupStatusRoutes} from "./status-router";

export default (app: Application) => {
    setupStatusRoutes(app)
    setupListingRoutes(app)
}
