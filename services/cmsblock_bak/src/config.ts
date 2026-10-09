import dotenv from 'dotenv';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

dotenv.config({quiet: true});

export const config = {
    port: Number(process.env.PORT ?? '4190'),
    host: '127.0.0.1',
    frontendUrl: process.env.FRONTEND_URL ??
        'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3001,http://127.0.0.1:3001',
    dataDirectory: resolve(process.env.CMSBLOCK_DATA_DIR ??
        fileURLToPath(new URL('../data/', import.meta.url))),
    route: {servicePrefix: '/cmsblock'},
    observability: {
        otelHost: process.env.OTEL_HOST ?? 'http://localhost:4318',
        serviceName: process.env.OTEL_SERVICE_NAME ?? 'reactedge-cmsblock',
    },
};
