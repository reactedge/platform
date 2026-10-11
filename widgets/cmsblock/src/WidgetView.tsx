import type {BootstrapData} from "./entrypoints/ssr.tsx";
import {readWidgetConfig} from "./Config.ts";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {WidgetCmsblock} from "./components/WidgetCmsblock.tsx";

type Props = {
    contract: unknown;
    runtime: unknown;
    bootstrapData: BootstrapData;
};

export const WidgetView = ({ contract, runtime, bootstrapData }: Props) => {

    const config = readWidgetConfig(contract, runtime);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtime={config.runtime} >
            <WidgetCmsblock config={config} bootstrap={bootstrapData} />
    </SystemStateProvider>
};

