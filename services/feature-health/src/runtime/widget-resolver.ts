import { JSDOM } from 'jsdom';

let registryCache: any = null;

export interface WidgetRegistryEntry {
    widget?: string;
    cdn: string;
    css?: string;
    ssr?: WidgetSsrConfig;
}

export interface WidgetSsrConfig {
    strategy: SsrStrategy;
    variants?: SsrVariant[];
}

export type SsrVariant =
    | 'desktop'
    | 'mobile'
    | 'tablet';

export type WidgetRegistry =
    Record<string, WidgetRegistryEntry>;

export async function getRegistry():WidgetRegistry {
    if (registryCache) {
        return registryCache;
    }

    const url = process.env.ENV_URL!;

    const html = await fetch(url).then(r => r.text());

    const dom = new JSDOM(html);

    const document = dom.window.document;

    const el = document.getElementById('reactedge-registry');

    if (!el) {
        throw new Error('Missing registry');
    }

    registryCache = JSON.parse(el.textContent || '{}');

    return registryCache;
}

export async function getResolvedEntry(registry: WidgetRegistry, instanceKey: string) {
    const entry = registry[instanceKey];

    if (!entry) {
        throw new Error(`No config for instance "${instanceKey}"`);
    }

    return {
        type: entry.widget, // or entry.type
        entry
    };
}