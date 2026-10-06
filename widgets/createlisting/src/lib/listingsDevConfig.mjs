/* global process */
import { mergeConfig } from 'vite';
import baseConfig from '../../vite.config.ts';

// Run the listingrecord service separately; this config only proxies API requests.
// npm run dev --workspace widget-createlisting -- --config src/lib/listingsDevConfig.mjs
export default mergeConfig(baseConfig, {
    server: {
        proxy: {
            '/listingrecord': {
                target: process.env.LISTINGRECORD_URL || 'http://127.0.0.1:4180',
            },
        },
    },
});
