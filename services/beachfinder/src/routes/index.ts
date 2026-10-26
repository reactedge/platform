import type {Application} from "express";
import {setupStatusRoutes} from "./status-router";
import {setupBeachRoutes} from "./beach-router";
import {BeachFinder} from "../model/beachfinder/beach-finder";

export default (app: Application, finder = new BeachFinder()) => {
    setupStatusRoutes(app);
    setupBeachRoutes(app, finder);
}
