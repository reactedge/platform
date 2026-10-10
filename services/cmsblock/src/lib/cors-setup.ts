import cors from 'cors';
import {config} from '../config';

export function corsOptions() {
    const allowed = config.frontendUrl.split(',').map(x => x.trim()).filter(Boolean);
    const checker = cors({origin: allowed, methods: 'GET,HEAD,OPTIONS,PUT,POST', allowedHeaders: ['Content-Type']});
    return checker;
}
