/**
 * Centralizes filesystem path construction and directory conventions. Prevents path-building logic from spreading everywhere.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import {getConfig} from "../config.ts";
import {getReactEdgeRoot} from "../../../packages/widget-build/shared-resources/filesystem/reactedgeRoot.ts";

const __filename = fileURLToPath(import.meta.url);

export function getWidgetPath(
    widgetName: string
): string {
    return path.join(
        getReactEdgeRoot(),
        'widgets',
        widgetName
    );
}

export function getWidgetAssetsPath(
    widgetName: string
): string {
    return path.join(
        getReactEdgeRoot(),
        'workspace',
        'release',
        'source',
        widgetName
    );
}

export function getWidgetManifestsPath(
    widgetName: string
): string {
    const CONFIG = getConfig()
    return path.join(
        getReactEdgeRoot(),
        'workspace',
        CONFIG.storeCode,
        'manifests',
        widgetName
    );
}

export function getContractPath(
    widgetName: string,
    contractFile: string
): string {
    const CONFIG = getConfig()
    return path.join(
        getReactEdgeRoot(),
        'workspace',
        CONFIG.storeCode,
        'contracts',
        widgetName,
        contractFile
    );
}

export function getRegistryPath(): string {
    return path.join(
        getReactEdgeRoot(),
        'workspace',
        'registry.json'
    );
}