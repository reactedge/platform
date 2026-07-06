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

export function readIntegrationConfig(storeCode: string, category: string): ReactEdgeRuntimeConfig {
    const configScript = document.getElementById('reactedge-runtime');

    if (!configScript) {
        throw new Error(`${WIDGET_ID} widget requires a <script id='reactedge-runtime'> block.`);
    }

    let config: ReactEdgeRuntimeConfig;
    try {
        config = JSON.parse(configScript.textContent);
    } catch {
        throw new Error(`${WIDGET_ID}: reactedge-runtime contains invalid JSON`);
    }

    if (!config.integrations?.magentoGraphql?.api) {
        throw new Error(`${WIDGET_ID}: magentoGraphql missing in reactedge-runtime`);
    }

    if (!config.integrations?.intentApi?.baseUrl) {
        throw new Error(`${WIDGET_ID}: intentApi baseUrl missing in reactedge-runtime`);
    }

    config.storeCode = storeCode
    config.category = category

    return config;
}

export function resolveIntentDiscoveryConfig(
    widget: RawWidgetConfig,
    runtime: ReactEdgeRuntimeConfig
): WidgetConfig {

    if (
        widget.integrations?.require?.includes('magentoGraphql') &&
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
