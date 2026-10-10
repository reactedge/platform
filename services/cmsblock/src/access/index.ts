import {setupJsonBodyParse} from "./jsonParser.js";
import {Application} from "express";

export default (app: Application) => {
    setupJsonBodyParse(app)
}
