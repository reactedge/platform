import cors from 'cors';
import {config} from '../config';

export const corsOptions = () => cors({
    allowedHeaders: ['Origin', 'Accept', 'Content-Type'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS',
    origin: config.frontendUrl.split(',').map((origin) => origin.trim()),
});
