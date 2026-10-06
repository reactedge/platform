import {setupJsonBodyParse} from "./jsonParser.js";
import {setupStaticFileAccess} from "./staticFile";
import type {Application} from "express";

export default (app: Application) => {
    setupJsonBodyParse(app)
    setupStaticFileAccess(app)
}
