import type { WidgetActivity } from "@reactedge/framework/activity";
import { parseConfig, type SchemaWidgetConfig } from "./ConfigSchema.ts";
import { parseRuntimeConfig, type SchemaRuntimeConfig } from "./ConfigSchemaRuntime.ts";

export interface WidgetConfig {
    readonly data: SchemaWidgetConfig["data"];
    readonly integrations: SchemaRuntimeConfig["integrations"];
}

export const WIDGET_ID = "beachfinder";

export function readWidgetConfig(
    contract: unknown,
    runtime: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const config = resolveConfig(parseConfig(contract), parseRuntimeConfig(runtime));
        activity?.log("bootstrap", "Config resolved", config);
        return Object.freeze(config);
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
    return { data: widget.data, integrations: runtime.integrations };
}
