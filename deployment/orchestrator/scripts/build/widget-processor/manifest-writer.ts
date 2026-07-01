/**
 * Creates and writes widget manifest files. Owns manifest serialization and storage.
 */
import type {WidgetManifest} from "../types.ts";
import {ReportScope} from "../report.ts";
import fs from 'fs';
import path from 'path';
import {getConfig} from "../../config.ts";

export function writeManifest(
    manifest: WidgetManifest,
    name: string,
    report: ReportScope
): string {
    const CONFIG = getConfig()

    report.info(
        'Writing widget manifest',
        {
            widget: name
        }
    );

    const filePath = path.join(
        CONFIG.assetTargetDir,
        CONFIG.assetStoreDir,
        'contracts',
        `${name}.json`
    );

    fs.writeFileSync(
        filePath,
        JSON.stringify(
            manifest,
            null,
            2
        )
    );

    report.success(
        'Widget manifest written',
        {
            widget: name,
            path: filePath
        }
    );

    return filePath;
}