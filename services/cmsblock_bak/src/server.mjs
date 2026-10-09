import {createServer} from 'node:http';
import {CmsBlockStore} from './store.mjs';

const base = '/cmsblock/blocks/demo';

export function createCmsBlockServer({directory, origins = [
    'http://localhost:5173', 'http://127.0.0.1:5173',
    'http://localhost:3001', 'http://127.0.0.1:3001',
]} = {}) {
    const store = new CmsBlockStore(directory);
    const allowed = new Set(origins);
    return createServer(async (req, res) => {
        const origin = req.headers.origin;
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        if (origin && !allowed.has(origin)) {
            res.writeHead(403);
            res.end(JSON.stringify({error: 'Origin not allowed.'}));
            return;
        }
        if (origin) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Vary', 'Origin');
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

        try {
            let result;
            if (req.method === 'GET' && req.url === '/cmsblock/status') {
                result = {status: 'ok', generator: 'deterministic-demo'};
            } else if (req.method === 'GET' && req.url === base) {
                result = await store.get();
                if (!result) { res.writeHead(404); res.end(JSON.stringify({error: 'Block not created yet.'})); return; }
            } else if (req.method === 'PUT' && req.url === base) {
                let raw = '';
                for await (const chunk of req) {
                    raw += chunk.toString();
                    if (raw.length > 120_000) throw new Error('Payload too large.');
                }
                result = await store.save(JSON.parse(raw));
            } else if (req.method === 'POST' && req.url === `${base}/generate`) {
                result = await store.generate();
            } else if (req.method === 'POST' && req.url === `${base}/approve`) {
                result = await store.approve();
            } else if (req.method === 'POST' && req.url === `${base}/reject`) {
                result = await store.reject();
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({error: 'Not found.'}));
                return;
            }
            res.writeHead(200);
            res.end(JSON.stringify(result));
        } catch (error) {
            res.writeHead(error instanceof SyntaxError || /before|content|template|draft|large|reject/i.test(error.message) ? 400 : 500);
            res.end(JSON.stringify({error: error instanceof Error ? error.message : 'CMSBlock operation failed.'}));
        }
    });
}
