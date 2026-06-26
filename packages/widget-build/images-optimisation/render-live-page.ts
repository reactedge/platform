import fs from 'fs/promises';
import {renderHtml} from "./entry.tsx";
import 'dotenv/config';

const run = async () => {
    const contractUrl = process.argv[2];

    if (!contractUrl) {
        throw new Error('Missing contract url');
    }

    const config = await fetch(contractUrl).then(r => r.json());
    const finalHtml = renderHtml(config)

    process.stdout.write(finalHtml);
};

run();