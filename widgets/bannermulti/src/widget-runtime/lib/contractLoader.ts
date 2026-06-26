export interface WidgetRegistryEntry {
    src?: string;
    integrity?: string;
    cdn?: string;
}

export type WidgetRegistry = Record<string, WidgetRegistryEntry>;

export async function loadContractByName(name: string, registry: WidgetRegistry) {
    const entry = registry[name];

    if (!entry?.cdn) {
        throw new Error(`No contract for ${name}`);
    }

    const res = await fetch(entry.cdn);
    return res.json();
}