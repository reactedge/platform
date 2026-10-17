import type { WidgetActivity } from "@reactedge/framework/activity";
import { parseConfig, type SchemaWidgetConfig } from "./ConfigSchema.ts";
import {
    parseRuntimeConfig,
    type SchemaRuntimeConfig,
} from "./ConfigSchemaRuntime.ts";
import type { GolfCourseFinderConfig } from "./domain/golf-course.types.ts";

export type WidgetConfig = GolfCourseFinderConfig;

export type ReactEdgeRuntimeConfig = SchemaRuntimeConfig;

export const WIDGET_ID = "golfcoursefinder";

export function readWidgetConfig(
    contract: unknown,
    runtime: unknown,
    activity?: WidgetActivity,
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
            "error",
        );
        throw error;
    }
}

export function resolveConfig(
    widget: SchemaWidgetConfig,
    runtime: SchemaRuntimeConfig,
): WidgetConfig {
    return {
        data: widget.data,
        integrations: {
            golfcoursesApi: runtime.integrations.golfcoursesApi,
            ...(runtime.integrations.googleMaps
                ? { googleMaps: runtime.integrations.googleMaps }
                : {}),
        },
        ...(widget.translations ? { translations: widget.translations } : {}),
    } satisfies GolfCourseFinderConfig;
}
