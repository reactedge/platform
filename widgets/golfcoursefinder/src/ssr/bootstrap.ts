import type { ReactEdgeRuntimeConfig } from "../bootstrap/config/Config.ts";
import { WIDGET_ID } from "../bootstrap/config/Config.ts";
import fs from "node:fs/promises";
import { parseRuntimeConfig } from "../bootstrap/config/ConfigSchemaRuntime.ts";

export async function loadRuntime(): Promise<ReactEdgeRuntimeConfig> {
    const path = `./widgets/${WIDGET_ID}/public/reactedge-runtime.json`;
    const parsed: unknown = JSON.parse(await fs.readFile(path, "utf8"));
    return parseRuntimeConfig(parsed);
}

export async function buildBootstrap() {
    return {};
}
