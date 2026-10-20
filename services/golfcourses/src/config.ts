import dotenv from 'dotenv';

dotenv.config({quiet: true});

export type Config = {
    port: number;
    frontendUrl: string;
    route: {servicePrefix: string};
    observability: {otelHost: string; serviceName: string};
    golfApi: {rapidApiKey: string; baseUrl: string};
    postcodeApi: {baseUrl: string};
};

export const config: Config = {
    port: Number(process.env.PORT ?? '4181'),
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173,http://127.0.0.1:5173',
    route: {
        servicePrefix: '/golfcourses',
    },
    observability: {
        otelHost: process.env.OTEL_HOST ?? 'http://localhost:4318',
        serviceName: process.env.OTEL_SERVICE_NAME ?? 'reactedge-golfcourses',
    },
    golfApi: {
        rapidApiKey: process.env.RAPIDAPI_KEY ?? '',
        baseUrl: process.env.GOLF_API_URL ?? 'https://uk-golf-api.vercel.app',
    },
    postcodeApi: {
        baseUrl: process.env.POSTCODE_API_URL ?? 'https://api.postcodes.io',
    },
};
