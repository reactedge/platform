import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import sharp from 'sharp';

const INPUT_FILE = './scripts/images.json';
const OUTPUT_DIR = './images-webp';

const MAX_WIDTH = 400;
const QUALITY = 80;

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// avoid duplicate downloads (png + jpg variants etc.)
const processed = new Set();

function getFilename(url) {
    const clean = url.split('?')[0];
    const base = path.basename(clean);
    const name = base.replace(/\.(png|jpg|jpeg)$/i, '');
    return name;
}

async function processImage(url) {
    const name = getFilename(url);

    if (processed.has(name)) return;
    processed.add(name);

    const outputPath = path.join(OUTPUT_DIR, `${name}.webp`);

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const buffer = Buffer.from(await res.arrayBuffer());

        const image = sharp(buffer);
        const metadata = await image.metadata();

        const width = metadata.width > MAX_WIDTH
            ? MAX_WIDTH
            : metadata.width;

        await image
            .resize({ width })
            .webp({ quality: QUALITY })
            .toFile(outputPath);

        console.log(`✓ ${name} (${metadata.width}px → ${width}px)`);

    } catch (err) {
        console.error(`✗ Failed: ${url}`);
        console.error(`   - ${err.message}`);
    }
}

async function run() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error('Missing images.json. Run extract-images first.');
        process.exit(1);
    }

    const images = JSON.parse(fs.readFileSync(INPUT_FILE));

    const rasterImages = images.filter(url =>
        url.match(/\.(png|jpg|jpeg)$/i)
    );

    console.log(`Optimizing ${rasterImages.length} images...\n`);

    // sequential is safer (avoid hammering CDN)
    for (const url of rasterImages) {
        await processImage(url);
    }

    console.log('\nDone.');
}

run();