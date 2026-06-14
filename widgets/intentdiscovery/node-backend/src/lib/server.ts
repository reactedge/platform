import express, { Application } from 'express'
import { config } from "../config";
import { initialiseApp } from "./initilisers";
import { ErrorWrapper } from "../error-handler";

export const startServer = async () => {
    const app: Application = express()
    const port = config.port
    const errorWrapper = new ErrorWrapper()

    console.log('port', port)

    await initialiseApp(app)

    try {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    } catch (error: unknown) {
        errorWrapper.handle(error)
    }
}
