import dotenv from 'dotenv';

dotenv.config({quiet: true});

export const config = {
    port: Number(process.env.PORT ?? '4182'),
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173,http://127.0.0.1:5173',
    routePrefix: '/evchargers',
    observability: {
        otelHost: process.env.OTEL_HOST ?? 'http://localhost:4318',
        serviceName: process.env.OTEL_SERVICE_NAME ?? 'reactedge-evchargerfinder',
    },
    ocmApiKey: process.env.OCM_API_KEY ?? '',
    ocmApiUrl: process.env.OCM_API_URL ?? 'https://api.openchargemap.io/v3/poi/',
    postcodeApiUrl: process.env.POSTCODE_API_URL ?? 'https://api.postcodes.io',
};
