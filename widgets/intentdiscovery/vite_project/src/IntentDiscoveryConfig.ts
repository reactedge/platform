import { activity } from "./activity";
import type {
    IntentDiscoveryDataConfig,
    MagentoIntegrationName,
    ReactEdgeRuntimeConfig,
    ResolvedIntentDiscoveryConfig
} from "./domain/intent-discovery.types.ts";

export const WIDGET_ID = 'intentdiscovery';

export type IntentDiscoveryTranslationsConfig = Record<string, string> | undefined;

export interface WidgetConfig {
    /**
     * Structured banner payload.
     * Shape is banner-owned and opaque to the platform.
     */
    readonly data: IntentDiscoveryDataConfig
    readonly translations?: IntentDiscoveryTranslationsConfig
    readonly integration: {
        readonly requires: readonly MagentoIntegrationName[];
    };
}

export function readWidgetConfig(
    rawConfig: WidgetConfig,
    runtimeConfig: ReactEdgeRuntimeConfig
): ResolvedIntentDiscoveryConfig {
    const resolved = resolveIntentDiscoveryConfig(rawConfig, runtimeConfig);

    activity('bootstrap', 'Config resolved', {
        data: resolved.data,
        runtime: resolved.runtime,
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
    widget: WidgetConfig,
    runtime: ReactEdgeRuntimeConfig
): ResolvedIntentDiscoveryConfig {

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
