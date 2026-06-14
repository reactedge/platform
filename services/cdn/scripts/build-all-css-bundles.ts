#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function findManifestFiles(dir: string): string[] {

    const entries = fs.readdirSync(dir, {
        withFileTypes: true
    });

    let results: string[] = [];

    for (const entry of entries) {

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            results = results.concat(
                findManifestFiles(fullPath)
            );
        }

        if (
            entry.isFile() &&
            entry.name === 'manifest.json'
        ) {
            results.push(fullPath);
        }
    }

    return results;
}

const manifests = findManifestFiles('www');

for (const manifest of manifests) {

    console.log(`\nBuilding: ${manifest}`);

    execSync(
        `npx tsx scripts/build-css-bundle.ts ${manifest}`,
        {
            stdio: 'inherit'
        }
    );
}

console.log('\n✔ All CSS bundles generated');