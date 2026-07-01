// util.ts
import { getConfig } from "../config.ts";
import { pathToFileURL } from "node:url";

export function getFilename(
    value: string
): string {
    return value.substring(
        value.lastIndexOf('/') + 1
    );
}

export function validateUrl(
    url: string
): void {
    const CONFIG = getConfig()

    const hostname =
        new URL(url).hostname;

    if (
        !CONFIG.allowedHosts.includes(
            hostname
        )
    ) {
        throw new Error(
            `Host "${hostname}" is not allowed`
        );
    }
}

export async function importParseConfig(schemaPath: string) {
    const module = await import(
        pathToFileURL(schemaPath).href
    );

    if (
        typeof module.parseConfig !==
        'function'
    ) {
        throw new Error('parseConfig not found');
    }

    return module.parseConfig;
}

export async function waitForServer(
    url: string,
    timeout = 10000
): Promise<void> {

    const start = Date.now();

    while (Date.now() - start < timeout) {
        try {
            const response = await fetch(url);

            if (response.ok) {
                return;
            }
        } catch {
            // Server not ready yet
        }

        await new Promise(resolve => setTimeout(resolve, 250));
    }

    throw new Error(`Server did not start within ${timeout}ms`);
}