import {parseConfig} from "./ConfigSchema.ts";
import type {WidgetActivity} from "./activity";
import type {
    ReactEdgeRuntimeConfig,
    ReactEdgeRuntimeIntegrations,
    StoreFinderDataConfig,
    TranslationsConfig
} from "./domain/store.types.ts";

export interface WidgetConfig {
    readonly data: StoreFinderDataConfig;
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly translations: TranslationsConfig
}

export interface RawWidgetConfig {
    data: StoreFinderDataConfig;
    integration: {
        requires: ('googleMaps')[];
    };
    translations?: TranslationsConfig
}

export const WIDGET_ID = 'storefinder';

export function readWidgetConfig(
    rawConfig: unknown,
    runtimeConfig: ReactEdgeRuntimeConfig,
    activity: WidgetActivity
): WidgetConfig {
    try {
        const contract = parseConfig(rawConfig);
        const resolved = resolveConfig(contract, runtimeConfig);

        activity.log('bootstrap', 'Config resolved', {
            data: resolved.data,
            integrations: resolved.integrations,
            translations: resolved.translations
        });



        activity?.log(
            'bootstrap',
            'Config resolved',
            contract
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

export function readIntegrationConfig(): ReactEdgeRuntimeConfig {
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

    if (!config.integrations?.googleMaps?.apiKey) {
        throw new Error(`${WIDGET_ID}: googleMaps missing in reactedge-runtime`);
    }

    return config;
}