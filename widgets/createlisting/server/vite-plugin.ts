import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { createListingsApi } from './api.ts';
import { ListingStore } from './store.ts';

export const defaultListingsFile = fileURLToPath(new URL('../.data/listings.json', import.meta.url));

export function listingsPlugin(): Plugin {
    const handler = createListingsApi(new ListingStore(process.env.LISTINGS_FILE || defaultListingsFile));
    return {
        name: 'reactedge-listings-api',
        configureServer(server) {
            server.middlewares.use((request, response, next) => {
                void handler(request, response).then(handled => { if (!handled) next(); }).catch(next);
            });
        },
    };
}
