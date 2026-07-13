import { JSDOM } from 'jsdom';
import { config } from "../config";
import { WidgetRegistry } from "../types"

let registryCache: any = null;

export async function getRegistry(): Promise<WidgetRegistry> {
    if (registryCache) {
        return registryCache;
    }

    const url = config.frontendUrl;

    const html = await fetch(url).then(r => r.text());

    const dom = new JSDOM(html);

    const document = dom.window.document;

    const el = document.getElementById('reactedge-registry');

    if (!el) {
        throw new Error('Missing registry');
    }

    registryCache = JSON.parse(el.textContent || '{}');

    return registryCache as WidgetRegistry;
}

export async function getResolvedEntry(registry: WidgetRegistry, instanceKey: string): Promise<any> {
    const entry = registry[instanceKey];

    if (!entry) {
        throw new Error(`No config for instance "${instanceKey}"`);
    }

    return {
        type: entry.widget, // or entry.type
        entry
    };
}