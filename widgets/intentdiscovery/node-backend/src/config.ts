const dotenv = require('dotenv');
dotenv.config();
const appRoot = require('app-root-path');

export type configInfo = {
    port: number;
    frontendUrl: string;
    siteConsumerUrl: string;
    cdnFolder: string,
    route: {
        apiPrefix: string;
        intentPrefix: string;
        openaiPrefix: string;
    },
    rootDir: string;
    openai: {
        model: string;
        performance: number;
        apiKey: string;
    }
}

export const config: configInfo = {
    port: (process.env.PORT === undefined)? 8080: Number(process.env.PORT),

    frontendUrl: (process.env.FRONTEND_URL === undefined)?'http://localhost:3001':process.env.FRONTEND_URL,

    siteConsumerUrl: (process.env.SITE_CONSUMER_URL === undefined)?'http://digitalrisedorset.com':process.env.SITE_CONSUMER_URL,
    cdnFolder: (process.env.CDN_FOLDER === undefined)? 'csv_export': process.env.CDN_FOLDER,

    /**
     * Routes access
     */
    route: {
        apiPrefix: '/',
        intentPrefix: '/intent',
        openaiPrefix: '/openai'
    },
    rootDir: appRoot.resolve('/'),
    openai: {
        model: (process.env.OPENAI_MODEL === undefined)? 'gpt-4o-mini': process.env.OPENAI_MODEL,
        performance: Number(process.env.OPENAI_PERFORMANCE ?? 0.2),
        apiKey: (process.env.OPENAI_API_KEY === undefined)? 'rrfdf': process.env.OPENAI_API_KEY
    }
}