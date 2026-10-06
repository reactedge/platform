import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { createListingsApi } from './api.ts';
import { ListingStore } from './store.ts';

const file = process.env.LISTINGS_FILE || fileURLToPath(new URL('../.data/listings.json', import.meta.url));
const handler = createListingsApi(new ListingStore(file));
const port = Number(process.env.LISTINGS_PORT || 4180);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid LISTINGS_PORT.');
createServer((request, response) => {
    void handler(request, response).then(handled => {
        if (!handled) { response.writeHead(404); response.end(); }
    }).catch(() => { response.writeHead(500); response.end(); });
}).listen(port, process.env.LISTINGS_HOST || '127.0.0.1');
