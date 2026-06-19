import fs from 'fs';

import { resolveWidgetEntry } from '../build/rebuild-registry/registry-loader.ts';
import { getContractPath, getManifestPath, getWidgetAssetsPath } from '../build/paths.ts';
import { getFilename } from '../build/util.ts';
import { wrapContract } from '../build/contract-loader/wrapper.ts';
import type { ContractWrapper, WidgetRegistry } from '../build/types.ts';
import { getAssetInfo } from "./read-widget-issues/asset-reader.ts";

export function loadWidgetContract(
    instanceId: string,
    registry: WidgetRegistry
): ContractWrapper {

    const resolved =
        resolveWidgetEntry(
            instanceId,
            registry
        );

    const widgetName =
        resolved.widget || instanceId;

    const assetInfo =
        getAssetInfo(
            instanceId,
            widgetName
        );

    const contractFile =
        getFilename(
            assetInfo.cdn
        );

    const contractPath =
        getContractPath(
            widgetName,
            contractFile
        );

    if (!fs.existsSync(contractPath)) {
        throw new Error(
            `Contract file not found: ${contractPath}`
        );
    }

    const content =
        fs.readFileSync(
            contractPath,
            'utf-8'
        );

    return wrapContract(
        JSON.parse(content) as ContractWrapper
    );
}

