import type { ReactEdgeRuntimeConfig } from "../Config.ts";
import { WIDGET_ID } from "../Config.ts";
import fs from 'node:fs/promises';

export async function loadRuntime(): Promise<ReactEdgeRuntimeConfig> {
    const path =
        `./widgets/${WIDGET_ID}/public/reactedge-runtime.json`;

    return JSON.parse(
        await fs.readFile(path, 'utf8')
    );
}

export async function buildBootstrap(_runtime: ReactEdgeRuntimeConfig) {
    return {};
}
