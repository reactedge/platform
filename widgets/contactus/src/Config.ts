import type {
    ReactEdgeRuntimeConfig, WidgetConfig
} from "./domain/contact.types.ts";
import type {WidgetActivity} from "./activity";
import type {RawWidgetConfig} from "./domain/raw.contact.types.ts";
import {normalizeOptionalFields, parseConfig, type SchemaWidgetConfig} from "./ConfigSchema.ts";

export const WIDGET_ID = 'contactus';

export function readWidgetConfig(
    rawConfig: RawWidgetConfig,
    runtimeConfig: ReactEdgeRuntimeConfig,
    activity: WidgetActivity
): WidgetConfig {
    const contract = parseConfig(rawConfig);
    const resolved = resolveConfig(contract, runtimeConfig);

    activity.log('bootstrap', 'Config resolved', resolved);

    return Object.freeze(resolved);
}

export function resolveConfig(
    widget: SchemaWidgetConfig,
    runtime: ReactEdgeRuntimeConfig
): WidgetConfig {

    if (
        widget.integration?.requires?.includes('cloudflare') &&
        !runtime.integrations?.cloudflare?.siteKey
    ) {
        throw new Error(`[${WIDGET_ID}] googleMaps integration required but not configured`);
    }

    return {
        ...widget,
        endpoint: widget.data.endpoint,
        fields: widget.data.fields.map((field) => {
           return normalizeOptionalFields(field, ['type'])
        }),
        integrations: {
            cloudflareKey: runtime.integrations?.cloudflare.siteKey
        },
        translations: widget?.translations
    };
}
