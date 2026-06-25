import express, {Application} from "express";

export const setupJsonBodyParse = (app: Application) => {
    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))
}
