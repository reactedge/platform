import dotenv from 'dotenv';
dotenv.config({quiet: true});

export type Config = {
    port: number;
    frontendUrl: string;
    route: {
        servicePrefix: string;
    };
    observability: {
        otelHost: string;
        serviceName: string;
    };
    providers: {
        postcodeApiUrl: string;
        overpassApiUrl: string;
    };
};

export const config: Config = {
    port: Number(process.env.PORT ?? '4185'),
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173,http://127.0.0.1:5173',
    route: {
        servicePrefix: '/beachfinder'
    },
    observability: {
        otelHost: process.env.OTEL_HOST ?? 'http://localhost:4318',
        serviceName: process.env.OTEL_SERVICE_NAME ?? 'reactedge-beachfinder'
    },
    providers: {
        postcodeApiUrl: process.env.POSTCODE_API_URL ?? 'https://api.postcodes.io/postcodes',
        overpassApiUrl: process.env.OVERPASS_API_URL ?? 'https://overpass-api.de/api/interpreter'
    }
};
