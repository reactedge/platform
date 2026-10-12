import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyConfiguration, listEnvironments, previewConfiguration, readConfiguration, readConfigurationTemplate, repositoryRoot, retainAdvancedSsrSettings } from './configuration.ts';

const ui = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'index.html'), 'utf8');
const stylesheet = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'style.css'), 'utf8');
const script = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'app.js'), 'utf8');
const host = '127.0.0.1';
const port = Number(process.env.REACTEDGE_UI_PORT || '4173');

const server = createServer(async (req, res) => {
    const origin = `http://${host}:${port}`;
    const send = (status: number, value: unknown) => {
        res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify(value));
    };
    if (req.headers.host !== `${host}:${port}`) return send(403, { error: 'Local requests only.' });
    const url = new URL(req.url || '/', origin);
    if (req.method === 'GET' && url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(ui);
    }
    if (req.method === 'GET' && url.pathname === '/style.css') {
        res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(stylesheet);
    }
    if (req.method === 'GET' && url.pathname === '/app.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(script);
    }
    try {
        if (req.method === 'GET' && url.pathname === '/api/environments') {
            return send(200, { environments: listEnvironments(repositoryRoot) });
        }
        if (req.method === 'GET' && url.pathname === '/api/config/template') {
            return send(200, readConfigurationTemplate(repositoryRoot));
        }
        if (req.method === 'GET' && url.pathname === '/api/config') {
            const storeCode = url.searchParams.get('store') || '';
            if (!listEnvironments(repositoryRoot).some(entry => entry.storeCode === storeCode)) {
                return send(404, { error: `Environment "${storeCode}" does not exist.` });
            }
            return send(200, readConfiguration(repositoryRoot, storeCode));
        }
        if (req.method === 'POST' && ['/api/preview', '/api/config'].includes(url.pathname)) {
            if (req.headers.origin !== origin || req.headers['content-type']?.split(';')[0] !== 'application/json') {
                return send(403, { error: 'Expected a same-origin JSON request.' });
            }
            let body = '';
            for await (const chunk of req) {
                body += chunk;
                if (body.length > 65536) return send(413, { error: 'Configuration is too large.' });
            }
            const submitted = JSON.parse(body);
            if (!submitted || typeof submitted !== 'object' || Array.isArray(submitted) ||
                !['create', 'update'].includes(submitted.operation) || typeof submitted.storeCode !== 'string') {
                return send(400, { error: 'Choose Create new or Load existing environment first.' });
            }
            const exists = listEnvironments(repositoryRoot).some(entry => entry.storeCode === submitted.storeCode);
            if (submitted.operation === 'create' && exists) return send(409, { error: `Environment "${submitted.storeCode}" already exists. Load it instead.` });
            if (submitted.operation === 'update' && !exists) return send(404, { error: `Environment "${submitted.storeCode}" does not exist. Create it instead.` });
            const input = retainAdvancedSsrSettings(repositoryRoot, submitted);
            return send(200, url.pathname === '/api/preview'
                ? previewConfiguration(repositoryRoot, input)
                : applyConfiguration(repositoryRoot, input));
        }
        return send(404, { error: 'Not found.' });
    } catch (error) {
        return send(400, { error: error instanceof Error ? error.message : 'Could not configure ReactEdge.' });
    }
});

server.listen(port, host, () => console.log(`ReactEdge configuration: http://${host}:${port}`));
