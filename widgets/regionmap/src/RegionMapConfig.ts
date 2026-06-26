import type {
    ReactEdgeRuntimeConfig,
    RegionMapWidgetConfig,
    ResolvedRegionMapConfig
} from "./domain/regionmap.types.ts";
import {WIDGET_ID} from "./mountWidget.tsx";
import {activity} from "./activity";

export function readWidgetConfig(
    hostElement: HTMLElement,
    rawConfig: RegionMapWidgetConfig | undefined
): ResolvedRegionMapConfig {

    let contract = rawConfig
    if (contract === null) {
        contract = readFallbackWidgetConfig(hostElement)
    }

    const runtime = readIntegrationConfig();
    const resolved = resolveWidgetConfig(contract, runtime);

    activity('bootstrap', 'Widget config', {
        data: resolved.data,
        integrations: resolved.integrations
    });

    return Object.freeze(resolved);
}

export function readFallbackWidgetConfig(
    hostElement: HTMLElement
): RegionMapWidgetConfig | undefined {
    const configScript = hostElement.querySelector<HTMLScriptElement>(
        'script[type="application/json"][data-config]'
    );

    if (!configScript) {
        throw new Error("RegionMap widget requires a <script data-config> block.");
    }

    try {
        const parsed = JSON.parse(configScript.textContent || "{}");
        return Object.freeze(parsed);
    } catch {

    }
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

export function resolveWidgetConfig(
    widget: RegionMapWidgetConfig | undefined,
    runtime: ReactEdgeRuntimeConfig
): ResolvedRegionMapConfig {
    if (widget === undefined) {
        throw new Error(`[${WIDGET_ID}] config is missing`);
    }

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
        }
    };
}
