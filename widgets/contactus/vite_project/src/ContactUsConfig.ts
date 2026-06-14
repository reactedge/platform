import type {ContactUsConfig, ContactUsRawConfig, IntegrationConfig} from "./domain/contact.types.ts";
import {WIDGET_ID} from "./mountWidget.tsx";
import {activity} from "./activity";

export function readWidgetConfig(
    rawConfig?: ContactUsRawConfig
): ContactUsConfig {
    let contract = rawConfig
    if (contract === null) {
        contract = readFallbackWidgetConfig()
    }

    const runtime = readIntegrationConfig();
    const resolved = resolveWidgetConfig(contract as ContactUsRawConfig, runtime);

    activity('bootstrap', 'Widget config', resolved);

    return Object.freeze(resolved);
}

export function resolveWidgetConfig(contract: ContactUsRawConfig, runtime: IntegrationConfig): ContactUsConfig {
    const resolved = {
        title: contract.data.title,
        intro: contract.data.intro,
        endpoint: contract.data.endpoint ?? null,
        categories: contract.data.categories ?? [],
        fields: contract.data.fields ?? [],
        cloudflareKey: runtime.integrations.cloudflare.siteKey
    }

    activity('bootstrap', 'Widget config loaded', resolved);

    return resolved
}

export function readFallbackWidgetConfig(): ContactUsRawConfig {
    const configScript = document.querySelector<HTMLScriptElement>(
        `script[type="application/json"][${WIDGET_ID}-data-config]`
    );

    if (!configScript) {
        throw new Error(`${WIDGET_ID} widget requires a <script ${WIDGET_ID}-data-config> block.`);
    }

    try {
        const parsed = JSON.parse(configScript.textContent || "{}");

        return Object.freeze(parsed);
    } catch {
        throw new Error(`${WIDGET_ID} widget invalid data`);
    }
}

export function readIntegrationConfig(): IntegrationConfig {
    const configScript = document.getElementById('reactedge-runtime');

    if (!configScript) {
        throw new Error("Booking widget requires a <script id='reactedge-runtime'> block.");
    }

    let config: IntegrationConfig;
    try {
        config = JSON.parse(configScript.textContent);
    } catch {
        throw new Error(`${WIDGET_ID}: reactedge-runtime contains invalid JSON`);
    }

    if (!config.integrations?.cloudflare?.siteKey) {
        throw new Error(`${WIDGET_ID}: cloudflare missing in reactedge-runtime`);
    }

    return config;
}
