import type {
    GoogleReviewsWidgetConfig,
    ReactEdgeRuntimeConfig,
    WidgetConfig
} from "./domain/googlereviews.types.ts";
import type {WidgetActivity} from "./activity";

export const WIDGET_ID = 'googlereviews';

export interface RawWidgetConfig {
    data: {
        country: string;
        title: string;
    };
    integration: {
        requires: ('googleMaps')[];
    };
}

export function readWidgetConfig(
    rawConfig: RawWidgetConfig,
    runtimeConfig: ReactEdgeRuntimeConfig,
    activity: WidgetActivity
): WidgetConfig {
    const resolved = resolveGoogleReviewsConfig(rawConfig, runtimeConfig);

    activity.log('bootstrap', 'Config resolved', {
        data: resolved.data,
        integrations: resolved.integrations,
        translations: resolved.translations
    });

    return Object.freeze(resolved);
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

    // if (!config.integrations?.googleMaps?.apiKey) {
    //     throw new Error(`${WIDGET_ID}: googleMaps missing in reactedge-runtime`);
    // }

    return config;
}

export function resolveGoogleReviewsConfig(
    widget: GoogleReviewsWidgetConfig,
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
