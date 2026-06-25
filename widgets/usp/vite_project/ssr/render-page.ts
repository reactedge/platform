import fs from 'fs/promises';
import { renderHtml } from "../vite_project/src/ssr/entry.tsx";
import 'dotenv/config';

const run = async () => {
    const contractPath = process.argv[2];

    if (!contractPath) {
        throw new Error('Missing contract path');
    }

    const config = JSON.parse(
        await fs.readFile(contractPath, 'utf8')
    );

    const runtime = {
        userAgent: process.argv[3] ?? ''
    };

    const finalHtml = renderHtml(config, runtime)

    process.stdout.write(finalHtml);
};

run();