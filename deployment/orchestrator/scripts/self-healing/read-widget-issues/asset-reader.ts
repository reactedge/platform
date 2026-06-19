import path from 'path';
import { readFileSync } from 'fs';
import {getManifestPath, getWidgetAssetsPath} from "../../build/paths.ts";
import {getConfig} from "../../config.ts";

export interface AssetInfo {
    src: string;
    hash: string | null;
    cdn: string;
    cssBundle: string | null;
    cssFilename: string | null;
}

export function getAssetInfo(
    widgetName: string,
    buildTarget: string
): AssetInfo {

    const config =
        getConfig();

    const manifestPath =
        path.join(
            getWidgetAssetsPath(buildTarget),
            `widget-${buildTarget}.manifest.json`
        );

    const manifest =
        JSON.parse(
            readFileSync(
                manifestPath,
                'utf-8'
            )
        );

    const {
        filename,
        hash,
        cssFilename
    } = manifest;

    if (!filename) {
        throw new Error(
            'Missing filename in manifest'
        );
    }

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

    const baseEntry =
        registry[buildTarget];

    const src =
        `${config.cdnUrl}/${buildTarget}/src/${filename}`;

    const cssBundle =
        baseEntry?.css
            ? `${config.cdnUrl}/${buildTarget}/styles/${baseEntry.css.replace('.css', '.bundle.css')}`
            : null;

    const cdn =
        `${config.cdnUrl}/${buildTarget}/contracts/${entry.cdn}`;

    return {
        src,
        hash: hash ?? null,
        cdn,
        cssBundle,
        cssFilename: cssFilename ?? null
    };
}

