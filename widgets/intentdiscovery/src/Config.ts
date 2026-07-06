import type {WidgetActivity} from "./activity";
import type {
    IntentDiscoveryDataConfig, IntentDiscoveryTranslationsConfig,
    ReactEdgeRuntimeConfig, ReactEdgeRuntimeIntegrations, ResolvedRuntimeConfig
} from "./domain/intent-discovery.types.ts";
import {parseConfig, type RawWidgetConfig} from "./ConfigSchema";

export const WIDGET_ID = 'intentdiscovery';

export interface WidgetConfig {
    /**
     * Structured banner payload.
     * Shape is banner-owned and opaque to the platform.
     */
    readonly data: IntentDiscoveryDataConfig
    readonly runtime: ResolvedRuntimeConfig
    readonly translations?: IntentDiscoveryTranslationsConfig
    readonly integrations: ReactEdgeRuntimeIntegrations
}

export function readWidgetConfig(
    rawConfig: RawWidgetConfig,
    runtimeConfig: ReactEdgeRuntimeConfig,
    activity?: WidgetActivity
): WidgetConfig {
    const contract = parseConfig(rawConfig);
    const resolved = resolveIntentDiscoveryConfig(contract, runtimeConfig);

    activity?.log('bootstrap', 'Config resolved', {
        data: resolved.data,
        integrations: resolved.integrations,
        translations: resolved.translations
    });

    return Object.freeze(resolved);
}

export function resolveIntentDiscoveryConfig(
    widget: RawWidgetConfig,
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
            storeCode: runtime.integrations?.magentoGraphql.storeCode,
            category: runtime.integrations?.magentoGraphql.category
        },
        integrations: {
            magentoGraphql: runtime.integrations?.magentoGraphql,
            intentApi: runtime.integrations.intentApi
        },
        translations: widget.translations
    };
}
