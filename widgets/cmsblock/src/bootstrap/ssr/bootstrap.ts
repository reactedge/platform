import type { ReactEdgeRuntimeConfig } from "../config/Config.ts";
import { WIDGET_ID } from "../config/Config.ts";
import fs from "node:fs/promises";
import { parseRuntimeConfig } from "../config/ConfigSchemaRuntime.ts";
import { createCmsBlockApiClient } from "../../services/cmsblock/CmsBlockApi.ts";

export async function loadRuntime(): Promise<ReactEdgeRuntimeConfig> {
    const path = `./widgets/${WIDGET_ID}/public/reactedge-runtime.json`;
    const parsed: unknown = JSON.parse(await fs.readFile(path, "utf8"));
    return parseRuntimeConfig(parsed);
}

export async function buildBootstrap(runtime: ReactEdgeRuntimeConfig) {
    const cmsBlockApi = createCmsBlockApiClient(runtime.integrations.cmsblockApi.api);
    return {
        record: await cmsBlockApi.get(),
    };
}
