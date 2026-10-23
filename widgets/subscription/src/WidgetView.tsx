import {readWidgetConfig} from "./Config.ts";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {WidgetSubscription} from "./components/WidgetSubscription.tsx";

type Props = {
    contract: unknown;
    runtime: unknown;
};

export const WidgetView = ({ contract, runtime }: Props) => {

    const config = readWidgetConfig(contract, runtime);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtime={config.runtime} >
        <WidgetSubscription config={config} />
    </SystemStateProvider>
};

