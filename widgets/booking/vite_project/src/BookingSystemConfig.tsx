import {activity} from "./activity";
import type {UserConfig} from "./state/User/type.ts";

export interface BookingWidgetConfig {
    api: string;
    venueId: string;
    cloudflareKey?: string;
}

export interface ResolvedBookingConfig {
    booking: BookingWidgetConfig;
    user: UserConfig
}

export interface BookingConfig {
    runtime: {
        venue: string
    };
    integrations: {
        api?: {
            graphql: string;
            auth: string;
        },
        requires: ["cloudflare"]
    };
}

interface BookingIntegrationConfig {
    integrations: {
        cloudflare: {
            siteKey: string;
        }
    }
}

export function readWidgetConfig(
    rawConfig: BookingConfig,
    hostElement: HTMLElement
): ResolvedBookingConfig {

    let contract = rawConfig
    if (contract === null) {
        contract = readFallbackWidgetConfig(hostElement)
    }

    const runtime = readIntegrationConfig();
    const resolved = resolveWidgetConfig(contract, runtime);

    activity('bootstrap', 'Widget config', resolved);

    return Object.freeze(resolved);
}

export function resolveWidgetConfig(contract: BookingConfig, runtime: BookingIntegrationConfig) {
    const config = {
        booking: {
            api: contract.integrations.api!.graphql,
            venueId: contract.runtime.venue,
            cloudflareKey: runtime.integrations?.cloudflare?.siteKey,
        },
        user: {
            auth: contract.integrations.api!.auth,
        }
    }

    activity('bootstrap', 'Widget config', config);

    return Object.freeze(config);
}

export function readFallbackWidgetConfig(hostElement: HTMLElement): BookingConfig {
    const configScript = hostElement.querySelector<HTMLScriptElement>(
        'script[type="application/json"][boking-data-config]'
    );

    if (!configScript) {
        throw new Error("Booking widget requires a <script boking-data-config> block.");
    }

    let config: BookingConfig;
    try {
        config = JSON.parse(configScript.textContent);
    } catch {
        throw new Error('BookingWidget: reactedge-config contains invalid JSON');
    }

    if (!config.integrations?.api?.graphql) {
        throw new Error('BookingWidget: booking.api missing in global config');
    }

    if (!config.integrations?.api?.auth) {
        throw new Error('BookingWidget: booking.auth missing in global config');
    }

    return config;
}

export function readIntegrationConfig(): BookingIntegrationConfig {
    const configScript = document.getElementById('reactedge-runtime');

    if (!configScript) {
        throw new Error("Booking widget requires a <script id='reactedge-runtime'> block.");
    }

    let config: BookingIntegrationConfig;
    try {
        config = JSON.parse(configScript.textContent);
    } catch {
        throw new Error('BookingWidget: reactedge-runtime contains invalid JSON');
    }

    if (!config.integrations?.cloudflare?.siteKey) {
        throw new Error('BookingWidget: cloudflare missing in reactedge-runtime');
    }

    return config;
}