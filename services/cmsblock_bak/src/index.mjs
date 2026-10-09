import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createCmsBlockServer} from './server.mjs';

const port = Number(process.env.PORT ?? 4190);
const directory = resolve(process.env.CMSBLOCK_DATA_DIR ?? fileURLToPath(new URL('../data/', import.meta.url)));
const origins = (process.env.FRONTEND_URL ?? 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3001,http://127.0.0.1:3001')
    .split(',').map(value => value.trim()).filter(Boolean);

// Bind to localhost only. Authentication and real AI generation are intentionally out of scope.
createCmsBlockServer({directory, origins}).listen(port, '127.0.0.1', () => {
    console.log(`CMSBlock demo API listening on http://127.0.0.1:${port}`);
});
