import path from 'path';
import fs from 'fs';

const FILE = path.resolve(process.cwd(), 'vite_project/public/cdn/mageosuk7.json');

const VALID_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

function isValidImage(src) {
    const ext = path.extname(src).toLowerCase();
    return VALID_EXTENSIONS.includes(ext);
}

function extractImages(data) {
    const images = [];

    function walk(node) {
        if (!node || typeof node !== 'object') return;

        if (node.image?.src && isValidImage(node.image.src)) {
            images.push(node.image.src);
        }

        for (const key in node) {
            walk(node[key]);
        }
    }

    walk(data);
    return images;
}

function run() {
    const raw = fs.readFileSync(FILE, 'utf-8');
    const json = JSON.parse(raw);

    const images = extractImages(json);

    console.log('Found images:\n');
    images.forEach(i => console.log(i));

    // optional: write to file for reuse
    fs.writeFileSync('./scripts/images.json', JSON.stringify(images, null, 2));
}

run();