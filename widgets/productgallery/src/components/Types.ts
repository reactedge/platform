export interface GalleryTile {
    src: string;
    srcset?: string;
    sizes?: string;
    alt?: string;
}

export interface WidgetConfig {
    readonly tiles:  GalleryTile[];
    readonly runtime: RuntimeConfig
    readonly integrations: ResolvedConfigIntegrations
}

export interface RuntimeConfig {
    storeCode: string;
    sku: string;
}

export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly storeCode: string;
    readonly sku: string;
}

export interface ReactEdgeRuntimeIntegrations {
    readonly magentoGraphql: {
        readonly api: string
    };
}

export interface ResolvedConfigIntegrations {
    readonly magentoGraphql: {
        readonly api: string
    };
}