// shared/scripts/sync-widget.ts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '../..');

const sourceDir = path.join(ROOT, 'shared');

const widgets = [
    'widget-usp',
    'widget-banner',
    'widget-bannermulti',
    'widget-megamenu',
];

for (const widgetDir of widgets) {
    const targetDir = path.join(ROOT, widgetDir);

    copyRecursive(sourceDir, targetDir);
    console.log(`✓ Shared files synced to ${widgetDir}`);
}

console.log('✓ All shared files synced');

function copyRecursive(source: string, target: string) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const entries = fs.readdirSync(source, {
        withFileTypes: true
    });

    for (const entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const targetPath = path.join(target, entry.name);

        if (entry.isDirectory()) {
            copyRecursive(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);

            console.log(
                `Copied ${path.relative(ROOT, sourcePath)}`
            );
        }
    }
}