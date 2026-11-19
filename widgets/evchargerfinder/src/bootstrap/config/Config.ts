import type { WidgetActivity } from "@reactedge/framework/activity";
import { parseConfig } from "./ConfigSchema.ts";
import { parseRuntimeConfig } from "./ConfigSchemaRuntime.ts";
import type { EVChargerFinderConfig } from "../../domain/ev-charger.types.ts";

export type WidgetConfig = EVChargerFinderConfig;
export const WIDGET_ID = "evchargerfinder";

export function readWidgetConfig(contract: unknown, runtime: unknown, activity: WidgetActivity): WidgetConfig {
  try {
    const widget = parseConfig(contract);
    const runtimeConfig = parseRuntimeConfig(runtime);
    const config = {
      data: widget.data,
      integrations: {
        evchargerfinderApi: runtimeConfig.integrations.evchargerfinderApi,
      },
      ...(widget.translations ? { translations: widget.translations } : {}),
    } satisfies WidgetConfig;
    activity.log("bootstrap", "EV charger finder config resolved");
    return config;
  } catch (error) {
    activity.log("bootstrap", "Invalid widget contract", error instanceof Error ? error.message : error, "error");
    throw error;
  }
}
