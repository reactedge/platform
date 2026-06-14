import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'vite_project/public/cdn/mageosuk7.json';
const OUTPUT_FILE = 'vite_project/public/cdn/mageosuk7.updated.json';

function isRaster(src) {
    return src.match(/\.(png|jpg|jpeg)$/i);
}

function toWebp(src) {
    return src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
}

function processNode(node) {
    if (!node || typeof node !== 'object') return;

    if (node.image && node.image.src) {
        const src = node.image.src;

        // skip if already processed
        if (node.image.fallback) return;

        if (isRaster(src)) {
            node.image = {
                ...node.image,
                src: toWebp(src),
                fallback: src
            };
        }
    }

    for (const key in node) {
        processNode(node[key]);
    }
}

function run() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Missing file: ${INPUT_FILE}`);
        process.exit(1);
    }

    const json = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));

    processNode(json);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(json, null, 2));

    console.log(`✓ CDN file updated → ${OUTPUT_FILE}`);
}

run();