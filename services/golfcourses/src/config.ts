import dotenv from 'dotenv';

dotenv.config({quiet: true});

export const config = {
    port: Number(process.env.PORT ?? '4181'),
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173,http://127.0.0.1:5173',
    rapidApiKey: process.env.RAPIDAPI_KEY ?? '',
    golfApiUrl: process.env.GOLF_API_URL ?? 'https://uk-golf-api.vercel.app',
    postcodeApiUrl: process.env.POSTCODE_API_URL ?? 'https://api.postcodes.io',
    routePrefix: '/golfcourses',
};

export const allowedOrigins = config.frontendUrl
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
