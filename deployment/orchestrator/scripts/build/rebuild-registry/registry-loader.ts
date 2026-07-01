/**
 * Loads, validates, and exposes the widget registry. Responsible for reading widgets-dev.json.
 */

import type { WidgetRegistry } from '../types.ts';
import fs from "fs";
import {RegistrySchema} from "./schema.ts";
import {getManifestPath} from "../paths.ts";

export function loadRegistry(): WidgetRegistry {
    const registryPath = getManifestPath();

    const rawRegistry = JSON.parse(
        fs.readFileSync(registryPath, 'utf-8')
    );

    return RegistrySchema.parse(rawRegistry);
}

export function resolveWidgets(
    selected: string[],
    registry: WidgetRegistry
): string[] {
    const expanded = new Set<string>();

    for (const widget of selected) {
        expanded.add(widget);

        for (const [name, entry] of Object.entries(registry)) {
            if (entry.widget === widget) {
                expanded.add(name);
            }
        }
    }

    return [...expanded];
}

export function resolveWidgetEntry(name: string, registry: WidgetRegistry) {
    const entry = registry[name];

    if (!entry) {
        throw new Error(`Widget "${name}" not found`);
    }

    if (entry.widget) {
        const base = registry[entry.widget];

        if (!base) {
            throw new Error(`Base widget "${entry.widget}" not found`);
        }

        return {
            ...base,
            ...entry, // override
        };
    }

    return entry;
}

export function expandWithAliases(
    selected: string[],
    registry: WidgetRegistry
) {
    const result = new Set<string>();

    for (const name of selected) {
        const entry = registry[name];
        if (!entry) {
            throw new Error(`Widget "${name}" not found`);
        }

        const base = 'widget' in entry ? entry.widget : name;

        for (const [otherName, otherEntry] of Object.entries(registry)) {
            const otherBase =
                'widget' in otherEntry ? otherEntry.widget : otherName;

            if (otherBase === base) {
                result.add(otherName);
            }
        }
    }

    return result;
}
