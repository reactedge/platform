import type {SsrStrategy} from "./rebuild-registry/schema.ts";

/**
 * Shared interfaces and domain types used by the build pipeline.
 */
export interface WidgetImageOptimisationConfig {
    scanFormats: string[];
    outputFormat: string;
    quality: number;
}

export interface WidgetRegistryEntry {
    widget?: string;
    cdn: string;
    css?: string;
    ssr?: WidgetSsrConfig;
    imageOptimisation?: WidgetImageOptimisationConfig;
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

export interface ProcessedWidget {
    name: string;
    manifestFile: string;
}

export type ContractData = Record<string, unknown>;

export interface ContractWrapper {
    _meta?: {
        site: string;
    };
    data: ContractData;
}

export interface AssetRegistryResult {
    src: string;
    cdn?: string;
    cssBundle?: string;
    cssFilename?: string;
    integrity: string
}

export interface ContractResult {
    contract: unknown | null;
    contractFile: string | null;
    localPath: string | null;
}

export type SsrViewMap =
    Partial<Record<SsrVariant, string>>;

export interface WidgetManifest {
    id: string;
    widget: string;
    src: string;
    css?: string | null,
    ssr: {
        views: SsrViewMap,
        css?: string | null;
        strategy: 'static' | 'dynamic' | 'disabled';
    };
    integrity?: string | null;
    contract?: unknown;
    contractFile?: string | null;
}

export interface Config {
    assetTargetDir: string;
    assetStoreDir: string;
    hostAssetsDir: string;
    optimisedAssetsDir: string,
    optimisedAssetsRelativePath: string;
    cdnUrl: string;
    projectRoot: string;
    targetSite: string,
    allowedHosts: string[],
    otelHost: string,
    otelServiceName: string,
    updateIntegrity: boolean
}

export interface ValidationIssue {
    code: string;
    path: string;
    message: string;
}
