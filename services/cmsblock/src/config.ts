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
};

export const config: Config = {
    port: Number(process.env.PORT ?? '4190'),
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    route: {
        servicePrefix: '/cmsblock'
    },
    observability: {
        otelHost: process.env.OTEL_HOST ?? 'http://localhost:4318',
        serviceName: process.env.OTEL_SERVICE_NAME ?? 'reactedge-cmsblock'
    }
};
