import {readWidgetConfig} from "../config/Config.ts";
import {SystemStateProvider} from "../../state/System/SystemStateProvider.tsx";
import {WidgetContactus} from "../../components/WidgetContactus.tsx";

type Props = {
    contract: unknown;
    runtime: unknown;
    bootstrap: unknown;
};

export const WidgetView = ({ contract, runtime, bootstrap }: Props) => {

    const config = readWidgetConfig(contract, runtime, bootstrap);

    if (!config) return null;

    return <SystemStateProvider config={config} >
            <WidgetContactus config={config} bootstrap={bootstrap} />
    </SystemStateProvider>
};

