import {config} from "../config";
import cors from "cors"

// https://brianflove.com/posts/2017-03-22-express-cors-typescript/
export const corsOptions = () => {
    const allowedOrigins = config.frontendUrl
        .split(',')
        .map(origin => origin.trim())

    const options = {
        allowedHeaders: [
            'Origin',
            'Accept'
        ],
        credentials: true,
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        origin: allowedOrigins,
        preflightContinue: false,
    };

    return cors(options)
}