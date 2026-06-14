import {config} from "../config";

const cors = require("cors")

// https://brianflove.com/posts/2017-03-22-express-cors-typescript/
export const corsOptions = () => {
    const allowedOrigins = config.frontendUrl
        .split(',')
        .map(origin => origin.trim())

    const options = {
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'X-Prompt-Version',
            'Content-Type',
            'Store',
            'Accept',
            'X-Access-Token',
        ],
        credentials: true,
        methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        origin: allowedOrigins,
        preflightContinue: false,
    };

    return cors(options)
}