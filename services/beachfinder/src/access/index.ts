import {setupJsonBodyParse} from "./jsonParser.js";
import type {Application} from "express";

export default (app: Application) => {
    setupJsonBodyParse(app)
}
