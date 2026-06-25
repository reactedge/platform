import express, {Application} from "express";
import {config} from "../config"

export const setupStaticFileAccess = (app: Application) => {
    app.use(`/${config.cdnFolder}`, express.static(config.rootDir + config.cdnFolder));
}