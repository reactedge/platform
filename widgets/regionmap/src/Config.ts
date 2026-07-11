import type {WidgetActivity} from "./activity";
import type {ReactEdgeRuntimeConfig, WidgetConfig} from "./domain/regionmap.types.ts";
import {normalizeOptionalFields, parseConfig, type SchemaWidgetConfig} from "./ConfigSchema.ts";

export const WIDGET_ID = 'regionmap';

export function readWidgetConfig(
    rawConfig: unknown,
    runtimeConfig: ReactEdgeRuntimeConfig,
    activity: WidgetActivity
): WidgetConfig {
    const contract = parseConfig(rawConfig);
    const resolved = resolveWidgetConfig(contract, runtimeConfig);

    activity.log('bootstrap', 'Config resolved', {
        data: resolved.data,
        integrations: resolved.integrations,
        translations: resolved.translations
    });

    return Object.freeze(resolved);
}


export function resolveWidgetConfig(
    widget: SchemaWidgetConfig,
    runtime: ReactEdgeRuntimeConfig
): WidgetConfig {

    if (
        widget.integration?.requires?.includes('googleMaps') &&
        !runtime.integrations?.googleMaps?.apiKey
    ) {
        throw new Error(`[${WIDGET_ID}] googleMaps integration required but not configured`);
    }

    const data = normalizeOptionalFields(widget.data, ["title"])

    return {
        data,
        integrations: runtime.integrations,
        translations: widget.translations
    };
}
