import type {Application} from "express";
import express from "express";

export const setupJsonBodyParse = (app: Application) => {
    app.use(express.json({limit: '4kb'}))
    app.use(express.urlencoded({
        extended: true
    }))
}
