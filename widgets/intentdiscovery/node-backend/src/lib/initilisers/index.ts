import routes from "../../routes/index.js";
import access from "../../access"
import {Application} from "express";

export const initialiseApp = async (app: Application) => {
    access(app)
    routes(app)
}