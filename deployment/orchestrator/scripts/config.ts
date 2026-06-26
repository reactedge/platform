import 'dotenv/config';
import dotenv from 'dotenv';
import type {Config} from "./build/types.ts";

let CONFIG: Config;

export function loadConfig(
    envFile: string
): void {

    dotenv.config({
        path: envFile,
        override: true
    });

    CONFIG = {
        assetTargetDir: process.env.TARGET_ASSET_DIR!,
        assetStoreDir: process.env.STORE_ASSET_PATH!,
        cdnUrl: process.env.WP_CDN_URL!,
        projectRoot: process.env.REACTEDGE_ROOT!,
        targetSite: process.env.TARGET_SITE!,
        allowedHosts: process.env.ALLOWED_HOSTS!
            .split(',')
            .map(host => host.trim()),
        otelHost: process.env.OTEL_HOST??  'http://localhost:4318/v1/traces',
        otelServiceName: 'reactedge-build',
        updateIntegrity: process.env.UPDATE_INTEGRITY
            ? process.env.UPDATE_INTEGRITY === 'true'
            : false
    };
}

export function getConfig(): Config {

    if (!CONFIG) {
        throw new Error(
            'Configuration has not been initialised'
        );
    }

    return CONFIG;
}
