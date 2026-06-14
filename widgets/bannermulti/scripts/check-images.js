import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import sizeOf from 'image-size';

const FILE = path.resolve(process.cwd(), 'scripts/images.json');
const MAX_SIZE_KB = 150;

async function checkImage(url) {
    try {
        const res = await fetch(url);

        const contentLength = res.headers.get('content-length');
        const sizeKB = contentLength ? contentLength / 1024 : null;

        const buffer = await res.arrayBuffer();
        const dimensions = sizeOf(Buffer.from(buffer));

        const issues = [];

        if (sizeKB && sizeKB > MAX_SIZE_KB) {
            issues.push(`size ${Math.round(sizeKB)}KB > ${MAX_SIZE_KB}KB`);
        }

        if (url.endsWith('.png')) {
            issues.push(`PNG used instead of WebP`);
        }

        if (issues.length) {
            console.warn(`⚠ ${url}`);
            issues.forEach(i => console.warn(`   - ${i}`));
            return false;
        }

        return true;
    } catch (err) {
        console.error(`✗ Failed to check ${url}`, err.message);
        return false;
    }
}

async function run() {
    const raw = fs.readFileSync(FILE, 'utf-8');
    const images = JSON.parse(raw);

    const results = await Promise.all(images.map(checkImage));

    const hasError = results.includes(false);

    if (hasError) {
        console.error('\n❌ Image validation failed.');
        process.exit(1);
    } else {
        console.log('✓ All images valid.');
    }
}

run();