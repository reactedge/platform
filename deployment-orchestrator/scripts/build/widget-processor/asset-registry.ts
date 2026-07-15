/**
 * Updates registry entries after a widget build. Owns updateRegistry() interactions and resulting asset metadata.
 */

import {ReportScope} from "../report.ts";
import {updateRegistry} from "../asset-registry/registry-updater.ts";
import {getRegistryPath, getWidgetAssetsPath} from "../paths.ts";
import type {AssetRegistryResult} from "../types.ts";

export function updateAssetRegistry(
    widgetName: string,
    name: string,
    report: ReportScope
): AssetRegistryResult {

    report.info(
        'Updating asset registry',
        {
            widget: name,
            buildTarget: widgetName
        }
    );

    const registryPath = getRegistryPath();
    const widgetAssetsDir = getWidgetAssetsPath(widgetName);

    const result = updateRegistry({
        widgetName: name,
        buildTarget: widgetName,
        registryPath,
        widgetAssetsDir
    });

    report.success(
        'Asset registry updated',
        {
            widget: name,
            cdn: result.cdn,
            cssBundle: result.cssBundle
        }
    );

    return result;
}