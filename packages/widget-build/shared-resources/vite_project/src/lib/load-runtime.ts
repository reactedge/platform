export interface RuntimeConfig {
    integrations: {
        cloudflare?: {
            siteKey: string;
        };
    };
}

export async function loadRuntime(): Promise<RuntimeConfig> {
    const response = await fetch("/launcher/runtime/reactedge-runtime.json");

    if (!response.ok) {
        throw new Error(
            `Unable to load ReactEdge runtime (${response.status})`
        );
    }

    return response.json() as Promise<RuntimeConfig>;
}