import type { IncomingMessage, ServerResponse } from 'node:http';
import { z, ZodError } from 'zod';
import { ListingNotFoundError } from './store.ts';
import type { ListingStore } from './store.ts';

class RequestError extends Error {
    readonly status: number;
    constructor(message: string, status: number) { super(message); this.status = status; }
}

async function readBody(request: IncomingMessage): Promise<unknown> {
    if (request.headers['content-type']?.split(';')[0] !== 'application/json') {
        throw new RequestError('Expected a JSON request.', 415);
    }
    let body = '';
    for await (const chunk of request) {
        body += chunk;
        if (Buffer.byteLength(body) > 8192) throw new RequestError('Request is too large.', 413);
    }
    try { return JSON.parse(body); }
    catch { throw new RequestError('Invalid JSON.', 400); }
}

export function createListingsApi(store: ListingStore) {
    return async (request: IncomingMessage, response: ServerResponse): Promise<boolean> => {
        const path = new URL(request.url || '/', 'http://localhost').pathname;
        if (path !== '/api/listings' && !path.startsWith('/api/listings/')) return false;
        const send = (status: number, value?: unknown) => {
            response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
            response.end(value === undefined ? undefined : JSON.stringify(value));
        };
        try {
            if (request.method !== 'GET' && request.headers.origin &&
                new URL(request.headers.origin).host !== request.headers.host) {
                throw new RequestError('Expected a same-origin request.', 403);
            }
            if (path === '/api/listings') {
                if (request.method === 'GET') send(200, await store.list());
                else if (request.method === 'POST') send(201, await store.create(await readBody(request)));
                else { response.setHeader('Allow', 'GET, POST'); send(405, { error: 'Method not allowed.' }); }
            } else {
                const id = path.slice('/api/listings/'.length);
                if (!z.uuid().safeParse(id).success) throw new RequestError('Listing not found.', 404);
                if (request.method === 'PUT') send(200, await store.update(id, await readBody(request)));
                else if (request.method === 'DELETE') { await store.delete(id); send(204); }
                else { response.setHeader('Allow', 'PUT, DELETE'); send(405, { error: 'Method not allowed.' }); }
            }
        } catch (error) {
            if (error instanceof ZodError) send(400, { error: error.issues[0]?.message || 'Invalid listing.' });
            else if (error instanceof RequestError) send(error.status, { error: error.message });
            else if (error instanceof ListingNotFoundError) send(404, { error: error.message });
            else send(500, { error: 'Unable to access listing storage.' });
        }
        return true;
    };
}
