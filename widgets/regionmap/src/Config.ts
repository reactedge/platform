import type {WidgetActivity} from "./activity";
import type {RawWidgetConfig, ReactEdgeRuntimeConfig, WidgetConfig} from "./domain/regionmap.types.ts";
import {parseConfig} from "./ConfigSchema.ts";

export const WIDGET_ID = 'regionmap';

export function readWidgetConfig(
    rawConfig: RawWidgetConfig,
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
    widget: RawWidgetConfig,
    runtime: ReactEdgeRuntimeConfig
): WidgetConfig {

    if (
        widget.integration?.requires?.includes('googleMaps') &&
        !runtime.integrations?.googleMaps?.apiKey
    ) {
        throw new Error(`[${WIDGET_ID}] googleMaps integration required but not configured`);
    }

    return {
        data: widget.data,
        integrations: {
            googleMaps: runtime.integrations?.googleMaps
        },
        translations: widget.translations
    };
}
