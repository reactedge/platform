export interface ReactEdgeRuntimeIntegrations {
    readonly magentoGraphql: {
        readonly api: string;
    };
    readonly intentApi?: {
        readonly baseUrl: string;
    };
}

interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;
    category: string;
    storeCode: string;
    sku: string
}

export function buildRuntimeConfig(): ReactEdgeRuntimeConfig | undefined {
    const configScript = document.getElementById('reactedge-runtime');

    if (!configScript) return;

    let config: ReactEdgeRuntimeConfig;

    try {
        config = JSON.parse(configScript.textContent || '');
    } catch {
        return;
    }

    return config;
}

export function stripMeta<T extends Record<string, any>>(
    contract: T
): T {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _meta,
        ...cleanContract
    } = contract;

    return cleanContract as T;
}