import {setupListingRoutes} from "./listing-router";
import {setupProductRoutes} from "./product-router";
import type {Application} from "express";
import {setupStatusRoutes} from "./status-router";

export default (app: Application) => {
    setupStatusRoutes(app)
    setupListingRoutes(app)
    setupProductRoutes(app)
}
