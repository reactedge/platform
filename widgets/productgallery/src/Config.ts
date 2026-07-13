import {type ReactEdgeRuntimeConfig, type WidgetConfig} from "./components/Types.ts";
import type {WidgetActivity} from "./activity";
import {parseConfig, type SchemaWidgetConfig} from "./ConfigSchema.ts";

export const WIDGET_ID = 'productgallery';

export function readWidgetConfig(
    rawConfig: unknown,
    runtimeConfig: ReactEdgeRuntimeConfig,
    activity?: WidgetActivity
): WidgetConfig {
    try {
        const contract = parseConfig(rawConfig);

        const resolved = resolveConfig(contract, runtimeConfig);

        activity?.log(
            'bootstrap',
            'Config resolved',
            resolved
        );

        return Object.freeze(resolved);

    } catch (e) {
        activity?.log(
            'bootstrap',
            'Invalid widget contract',
            e instanceof Error? e.message: e,
            'error'
        );

        throw e;
    }
}

export function resolveConfig(
    widget: SchemaWidgetConfig,
    runtime: ReactEdgeRuntimeConfig
): WidgetConfig {

    if (
        widget.integration?.requires?.includes('magentoGraphql') &&
        !runtime.integrations?.magentoGraphql?.api
    ) {
        throw new Error(`[${WIDGET_ID}] magentoGraphql integration required but not configured`);
    }

    return {
        tiles: widget.data.images,
        runtime: {
            storeCode: runtime.storeCode,
            sku: runtime.sku
        },
        integrations: {
            magentoGraphql: runtime.integrations?.magentoGraphql
        }
    };
}
