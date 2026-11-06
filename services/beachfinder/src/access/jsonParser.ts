import type {Application} from "express";
import express from "express";

export const setupJsonBodyParse = (app: Application) => {
    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))
}
