import type {BootstrapData} from "./entry.tsx";
import {readWidgetConfig} from "../Config.ts";
import {SystemStateProvider} from "../state/System/SystemStateProvider.tsx";
import {ProductGalleryWidget} from "../components/ProductGalleryWidget.tsx";

type Props = {
    rawConfig: unknown;
    runtimeConfig: unknown
    bootstrapData: BootstrapData
};

export const WidgetView = ({ rawConfig, runtimeConfig, bootstrapData }: Props) => {

    const config = readWidgetConfig(rawConfig, runtimeConfig);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtimeConfig={config.runtime} >
        <ProductGalleryWidget config={config} bootstrap={bootstrapData} />
    </SystemStateProvider>
};

