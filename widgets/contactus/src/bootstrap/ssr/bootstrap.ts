import { WIDGET_ID } from "../config/Config.ts";
import fs from 'node:fs/promises';
import type { ReactEdgeRuntimeConfig } from "../../domain/contact.types.ts";

export async function loadRuntime(): Promise<ReactEdgeRuntimeConfig> {
    const path =
        `./widgets/${WIDGET_ID}/public/reactedge-runtime.json`;

    return JSON.parse(
        await fs.readFile(path, 'utf8')
    );
}

export async function buildBootstrap(runtime: ReactEdgeRuntimeConfig) {
    void runtime;

    return {};
}