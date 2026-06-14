import { readFileSync } from 'fs';
import { getConfig } from '../../config.ts';
import {getManifestPath} from "../../build/paths.ts";

export function getContractCdn(
    widgetName: string,
    buildTarget: string
): string {

    const config =
        getConfig();

    const registry =
        JSON.parse(
            readFileSync(
                getManifestPath(),
                'utf-8'
            )
        );

    const entry =
        registry[widgetName];

    if (!entry) {
        throw new Error(
            `Widget "${widgetName}" not found in registry`
        );
    }

    if (!entry.cdn) {
        throw new Error(
            `Widget "${widgetName}" has no contract configured`
        );
    }

    return `${config.cdnUrl}/${buildTarget}/contracts/${entry.cdn}`;
}