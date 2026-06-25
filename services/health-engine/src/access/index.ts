import {setupJsonBodyParse} from "./jsonParser.js";
import {Application} from "express";
import {setupStaticFileAccess} from "./staticFile";

export default (app: Application) => {
    setupJsonBodyParse(app)
    setupStaticFileAccess(app)
}