import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const VITE_DIR = path.resolve(ROOT, 'vite_project');
const OUTPUT_FILE = path.resolve(VITE_DIR, 'dist/reactedge-loader.js');

import {CONFIG} from "./config.ts";

const ENV = process.env.NODE_ENV || 'dev';
const WP_JS_DIR = CONFIG[ENV].jsDir;
const WP_SCRIPTS_DIR = CONFIG[ENV].scriptDir;

console.log(`=== RELEASE ORCHESTRATOR ===`);

try {
    // 1. Build
    execSync(`npm run build`, {
        cwd: VITE_DIR,
        stdio: 'inherit'
    });

    // 2. Validate artifact exists
    if (!fs.existsSync(OUTPUT_FILE)) {
        throw new Error(`Build failed: reactedge-widget.js not found`);
    }

    // 3. Copy artifact
    const target = path.join(WP_JS_DIR, 'reactedge-loader.js');
    fs.copyFileSync(OUTPUT_FILE, target);

    console.log(`Copied bundle to ${target}`);

    if (WP_SCRIPTS_DIR) {
        // 4. Run post-build script
        execSync(`./build-js.sh`, {
            cwd: WP_SCRIPTS_DIR,
            stdio: 'inherit'
        });
    }

    console.log(`=== ORCHESTRATOR UPDATED ===`);

} catch (err) {
    console.error(`❌ RELEASE FAILED`, err);
    process.exit(1);
}