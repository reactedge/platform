import { SystemStateProvider } from "./state/System/SystemStateProvider.tsx";
import type { BootstrapData } from "./ssr/entry.tsx";
import { readWidgetConfig } from "./Config.ts";
import type { ReactEdgeRuntimeConfig } from "./components/Types.ts";
import { ProductGalleryWidget } from "./components/ProductGalleryWidget.tsx";

type Props = {
    rawConfig: unknown;
    runtimeConfig: ReactEdgeRuntimeConfig
    bootstrapData: BootstrapData
};

export const WidgetView = ({ rawConfig, runtimeConfig, bootstrapData }: Props) => {

    const config = readWidgetConfig(rawConfig, runtimeConfig);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtimeConfig={config.runtime} >
        <ProductGalleryWidget config={config} bootstrap={bootstrapData} />
    </SystemStateProvider>
};

