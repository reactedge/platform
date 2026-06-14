#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const IMPORT_REGEX = /@import\s+["'](.+?)["'];?/g;

function resolveCss(
    filePath: string,
    visited = new Set<string>()
): string {

    const absolutePath = path.resolve(filePath);

    if (absolutePath.endsWith('.bundle.css')) {
        return '';
    }

    if (visited.has(absolutePath)) {
        return '';
    }

    visited.add(absolutePath);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(`CSS file not found: ${absolutePath}`);
    }

    let content = fs.readFileSync(absolutePath, 'utf8');

    const directory = path.dirname(absolutePath);

    content = content.replace(
        IMPORT_REGEX,
        (_, importPath: string) => {

            const childPath = path.resolve(
                directory,
                importPath
            );

            return resolveCss(childPath, visited);
        }
    );

    return `
/* ===================================================== */
/* SOURCE: ${path.basename(absolutePath)} */
/* ===================================================== */

${content}
`;
}

function buildBundle(manifestPath: string) {

    const manifest = JSON.parse(
        fs.readFileSync(manifestPath, 'utf8')
    );

    const cssEntryFile = path.join(
        path.dirname(manifestPath),
        manifest.entry
    );

    const outputFile = cssEntryFile.replace(
        /\.css$/,
        '.bundle.css'
    );

    const result = resolveCss(cssEntryFile);

    fs.writeFileSync(outputFile, result);

    console.log(`✔ CSS bundle generated`);
    console.log(`ENTRY : ${cssEntryFile}`);
    console.log(`OUTPUT: ${outputFile}`);
}

const [, , manifestPath] = process.argv;

if (!manifestPath) {

    console.error(`
Usage:

npx tsx scripts/build-css-bundle.ts www/banner/styles/manifest.json
`);

    process.exit(1);
}

buildBundle(manifestPath);