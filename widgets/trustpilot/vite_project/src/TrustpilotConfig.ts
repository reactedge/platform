import {WIDGET_ID} from "./mountWidget.tsx";
import {loadContract} from "./widget-runtime/lib/contractLoader.ts";
import {activity} from "./activity";
import type {
    TrustpilotWidgetConfig,
    ReactEdgeRuntimeConfig,
    ResolvedTrustpilotConfig
} from "./domain/trustpilot.types.ts";

export async function readWidgetConfig(
    hostElement: HTMLElement
): Promise<ResolvedTrustpilotConfig> {

    const contract = await loadContract(hostElement);

    const runtime = readIntegrationConfig();
    const resolved = resolveTrustpilotConfig(contract, runtime);

    activity('bootstrap', 'Config resolved', {
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

export function resolveTrustpilotConfig(
    widget: TrustpilotWidgetConfig,
    runtime: ReactEdgeRuntimeConfig
): ResolvedTrustpilotConfig {

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
