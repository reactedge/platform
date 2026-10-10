import {createServer, type IncomingMessage, type ServerResponse} from 'node:http';
import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
    applyConfiguration,
    listEnvironments,
    previewConfiguration,
    readConfiguration,
    readConfigurationTemplate,
    repositoryRoot,
    retainAdvancedSsrSettings,
} from './configuration.ts';

const ui = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'index.html'), 'utf8');
const stylesheet = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'style.css'), 'utf8');
const script = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'app.js'), 'utf8');
const host = '127.0.0.1';
const port = Number(process.env.REACTEDGE_UI_PORT || '4173');
const origin = `http://${host}:${port}`;
type SendResponse = (status: number, value: unknown) => void;

function sendJson(res: ServerResponse, status: number, value: unknown): void {
    res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'});
    res.end(JSON.stringify(value));
}

function serveStatic(pathname: string, res: ServerResponse): boolean {
    const assets: Record<string, {type: string; body: string}> = {
        '/': {type: 'text/html', body: ui},
        '/style.css': {type: 'text/css', body: stylesheet},
        '/app.js': {type: 'text/javascript', body: script},
    };
    const asset = assets[pathname];
    if (!asset) return false;
    res.writeHead(200, {'Content-Type': `${asset.type}; charset=utf-8`, 'Cache-Control': 'no-store'});
    res.end(asset.body);
    return true;
}

function handleReadApi(req: IncomingMessage, url: URL, send: SendResponse): boolean {
    if (req.method !== 'GET') return false;
    if (url.pathname === '/api/environments') {
        send(200, {environments: listEnvironments(repositoryRoot)});
        return true;
    }
    if (url.pathname === '/api/config/template') {
        send(200, readConfigurationTemplate(repositoryRoot));
        return true;
    }
    if (url.pathname !== '/api/config') return false;
    const storeCode = url.searchParams.get('store') || '';
    if (!listEnvironments(repositoryRoot).some(entry => entry.storeCode === storeCode)) {
        send(404, {error: `Environment "${storeCode}" does not exist.`});
        return true;
    }
    send(200, readConfiguration(repositoryRoot, storeCode));
    return true;
}

async function readSubmission(req: IncomingMessage, send: SendResponse): Promise<Record<string, unknown> | undefined> {
    let body = '';
    for await (const chunk of req) {
        body += chunk;
        if (body.length > 65536) {
            send(413, {error: 'Configuration is too large.'});
            return undefined;
        }
    }
    const submitted: unknown = JSON.parse(body);
    if (!submitted || typeof submitted !== 'object' || Array.isArray(submitted) ||
        !['create', 'update'].includes(String((submitted as Record<string, unknown>).operation)) ||
        typeof (submitted as Record<string, unknown>).storeCode !== 'string') {
        send(400, {error: 'Choose Create new or Load existing environment first.'});
        return undefined;
    }
    return submitted as Record<string, unknown>;
}

function applySubmittedConfiguration(url: URL, submitted: Record<string, unknown>, send: SendResponse): void {
    const operation = submitted.operation as string;
    const storeCode = submitted.storeCode as string;
    const exists = listEnvironments(repositoryRoot).some(entry => entry.storeCode === storeCode);
    if (operation === 'create' && exists) {
        send(409, {error: `Environment "${storeCode}" already exists. Load it instead.`});
        return;
    }
    if (operation === 'update' && !exists) {
        send(404, {error: `Environment "${storeCode}" does not exist. Create it instead.`});
        return;
    }
    const input = retainAdvancedSsrSettings(repositoryRoot, submitted);
    send(200, url.pathname === '/api/preview'
        ? previewConfiguration(repositoryRoot, input)
        : applyConfiguration(repositoryRoot, input));
}

async function handleWriteApi(req: IncomingMessage, url: URL, send: SendResponse): Promise<boolean> {
    if (req.method !== 'POST' || !['/api/preview', '/api/config'].includes(url.pathname)) return false;
    if (req.headers.origin !== origin || req.headers['content-type']?.split(';')[0] !== 'application/json') {
        send(403, {error: 'Expected a same-origin JSON request.'});
        return true;
    }
    const submitted = await readSubmission(req, send);
    if (submitted) applySubmittedConfiguration(url, submitted, send);
    return true;
}

async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const send: SendResponse = (status, value) => sendJson(res, status, value);
    if (req.headers.host !== `${host}:${port}`) {
        send(403, {error: 'Local requests only.'});
        return;
    }
    const url = new URL(req.url || '/', origin);
    if (req.method === 'GET' && serveStatic(url.pathname, res)) return;
    try {
        if (handleReadApi(req, url, send)) return;
        if (await handleWriteApi(req, url, send)) return;
        send(404, {error: 'Not found.'});
    } catch (error) {
        send(400, {error: error instanceof Error ? error.message : 'Could not configure ReactEdge.'});
    }
}

const server = createServer(handleRequest);
server.listen(port, host, () => console.log(`ReactEdge configuration: http://${host}:${port}`));
