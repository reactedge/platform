/* global Buffer */
import { randomUUID } from 'node:crypto';
import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import { mergeConfig } from 'vite';
import { z } from 'zod';
import baseConfig from '../../vite.config.ts';
import { ListingNameSchema, ListingsSchema } from './listings.ts';

// Run: npm run dev --workspace widget-createlisting -- --config src/lib/listingsDevConfig.mjs
// Development-only file persistence. The canonical Vite config stays unchanged.
const file = fileURLToPath(new URL('../../public/listings.json', import.meta.url));
const InputSchema = z.object({ name: ListingNameSchema }).strict();
let pending = Promise.resolve();

const listingsApi = {
    name: 'createlisting-file-persistence',
    configureServer(server) {
        server.middlewares.use((request, response, next) => {
            if (request.url?.split('?')[0] !== '/api/createlisting') { next(); return; }
            const send = (status, body) => {
                response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
                response.end(JSON.stringify(body));
            };
            const save = async () => {
                if (request.method !== 'POST') {
                    response.setHeader('Allow', 'POST');
                    send(405, { error: 'Method not allowed.' }); return;
                }
                if (request.headers.origin && new URL(request.headers.origin).host !== request.headers.host) {
                    send(403, { error: 'Expected a same-origin request.' }); return;
                }
                if (request.headers['content-type']?.split(';')[0] !== 'application/json') {
                    send(415, { error: 'Expected JSON.' }); return;
                }
                let body = '';
                for await (const chunk of request) {
                    body += chunk;
                    if (Buffer.byteLength(body) > 4096) { send(413, { error: 'Request too large.' }); return; }
                }
                let input;
                try { input = InputSchema.parse(JSON.parse(body)); }
                catch { send(400, { error: 'Enter a listing name between 1 and 50 characters.' }); return; }
                const record = { id: randomUUID(), name: input.name };
                const mutation = pending.then(async () => {
                    const records = ListingsSchema.parse(JSON.parse(await readFile(file, 'utf8')));
                    records.push(record);
                    const temporary = `${file}.${randomUUID()}.tmp`;
                    try {
                        await writeFile(temporary, `${JSON.stringify(records, null, 2)}\n`, { flag: 'wx' });
                        await rename(temporary, file);
                    } finally { await rm(temporary, { force: true }); }
                });
                pending = mutation.catch(() => undefined);
                await mutation;
                send(201, record);
            };
            void save().catch(() => send(500, { error: 'Unable to save listing.' }));
        });
    },
};

export default mergeConfig(baseConfig, { plugins: [listingsApi] });
