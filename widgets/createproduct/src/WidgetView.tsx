import type {BootstrapData} from "./entrypoints/ssr.tsx";
import {readWidgetConfig} from "./Config.ts";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {WidgetCreateproduct} from "./components/WidgetCreateproduct.tsx";

type Props = {
    contract: unknown;
    runtime: unknown;
    bootstrapData: BootstrapData;
};

export const WidgetView = ({ contract, runtime, bootstrapData }: Props) => {

    const config = readWidgetConfig(contract, runtime);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtime={config.runtime} >
        <WidgetCreateproduct config={config} bootstrap={bootstrapData} />
    </SystemStateProvider>
};

