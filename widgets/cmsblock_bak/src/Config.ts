import {parseConfig, type WidgetConfig as ParsedWidgetConfig} from "./ConfigSchema.ts";
import {parseRuntimeConfig, type CmsBlockRuntimeConfig} from "./ConfigSchemaRuntime.ts";
import type {WidgetActivity} from "@reactedge/framework/activity";

export type WidgetConfig = ParsedWidgetConfig & Pick<CmsBlockRuntimeConfig, "integrations">;

export const WIDGET_ID = "cmsblock";

/** Validates the widget contract and runtime service integration at the widget boundary. */
export function readWidgetConfig(
    rawContract: unknown,
    rawRuntime: unknown,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        activity?.log("bootstrap", "Config sent", {contract: rawContract, runtime: rawRuntime});
        const contract = parseConfig(rawContract);
        const runtime = parseRuntimeConfig(rawRuntime);
        const config: WidgetConfig = {
            ...contract,
            integrations: runtime.integrations,
        };
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
