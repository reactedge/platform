import { parseConfig, type SchemaWidgetConfig } from "./ConfigSchema.ts";
import type { WidgetActivity } from "@reactedge/framework/activity";
import {
    parseRuntimeConfig,
    type SchemaRuntimeConfig,
} from "./ConfigSchemaRuntime.ts";

export interface RuntimeConfig {
    readonly storeCode: string;
    readonly sku: string;
    readonly category?: string;
}

export interface CmsBlockApiIntegration {
    readonly api: string;
}

export type ReactEdgeRuntimeConfig = SchemaRuntimeConfig;

export interface WidgetConfig {
    readonly data: SchemaWidgetConfig["data"];
    readonly settings: SchemaWidgetConfig["settings"];
    readonly runtime: RuntimeConfig;
    readonly integrations: {
        readonly cmsblockApi: CmsBlockApiIntegration;
    };
}

export const WIDGET_ID = "cmsblock";

export function readWidgetConfig(
    contract: unknown,
    runtime: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const parsedContract = parseConfig(contract);
        const parsedRuntime = parseRuntimeConfig(runtime);
        const resolved = resolveConfig(parsedContract, parsedRuntime);
        activity?.log("bootstrap", "Config resolved", resolved);
        return Object.freeze(resolved);
    } catch (error) {
        activity?.log(
            "bootstrap",
            "Invalid widget contract or runtime configuration",
            error instanceof Error ? error.message : error,
            "error"
        );
        throw error;
    }
}

export function resolveConfig(
    widget: SchemaWidgetConfig,
    runtime: SchemaRuntimeConfig
): WidgetConfig {
    return {
        data: widget.data,
        settings: widget.settings,
        runtime: runtime.context,
        integrations: runtime.integrations,
    };
}
