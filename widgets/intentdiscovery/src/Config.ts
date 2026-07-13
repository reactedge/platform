import type {WidgetActivity} from "./activity";
import type {
    IntentDiscoveryDataConfig, TranslationsConfig,
    ReactEdgeRuntimeConfig, ReactEdgeRuntimeIntegrations, ResolvedRuntimeConfig
} from "./domain/intent-discovery.types.ts";
import {parseConfig, type SchemaWidgetConfig} from "./ConfigSchema";

export const WIDGET_ID = 'intentdiscovery';

export interface WidgetConfig {
    /**
     * Structured banner payload.
     * Shape is banner-owned and opaque to the platform.
     */
    readonly data: IntentDiscoveryDataConfig
    readonly runtime: ResolvedRuntimeConfig
    readonly translations?: TranslationsConfig
    readonly integrations: ReactEdgeRuntimeIntegrations
}

export function readWidgetConfig(
    rawConfig: unknown,
    runtimeConfig: ReactEdgeRuntimeConfig,
    activity?: WidgetActivity
): WidgetConfig {
    const contract = parseConfig(rawConfig);
    const resolved = resolveConfig(contract, runtimeConfig);

    activity?.log('bootstrap', 'Config resolved', {
        data: resolved.data,
        integrations: resolved.integrations,
        translations: resolved.translations
    });

    return Object.freeze(resolved);
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
        data: widget.data,
        runtime: {
            storeCode: runtime.storeCode,
            category: runtime.category
        },
        integrations: {
            magentoGraphql: runtime.integrations?.magentoGraphql,
            intentApi: runtime.integrations.intentApi
        },
        translations: widget.translations
    };
}
