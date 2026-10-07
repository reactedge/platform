import dotenv from 'dotenv';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
dotenv.config({quiet: true});

export type Config = {
    port: number;
    frontendUrl: string;
    rootDir: string;
    cdnFolder: string;
    route: {
        servicePrefix: string;
    };
    observability: {
        otelHost: string;
        serviceName: string;
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
        folder: string;
    };
};

export const config: Config = {
    port: Number(process.env.PORT ?? '4180'),
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173,http://127.0.0.1:5173',
    rootDir: path.resolve(process.env.ROOT_DIR ?? fileURLToPath(new URL('../', import.meta.url))),
    cdnFolder: process.env.CDN_FOLDER ?? 'listing-data',
    route: {
        servicePrefix: '/listingrecord'
    },
    observability: {
        otelHost: process.env.OTEL_HOST ?? 'http://localhost:4318',
        serviceName: process.env.OTEL_SERVICE_NAME ?? 'reactedge-listingrecord'
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
        apiKey: process.env.CLOUDINARY_API_KEY ?? '',
        apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
        folder: process.env.CLOUDINARY_FOLDER ?? 'reactedge/products',
    },
};
