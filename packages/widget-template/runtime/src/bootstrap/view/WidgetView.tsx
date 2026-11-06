import type {BootstrapData} from "../ssr/render.tsx";
import {readWidgetConfig} from "../config/Config.ts";
import {SystemStateProvider} from "../../state/System/SystemStateProvider.tsx";
import {Widget__WIDGET_PASCAL_NAME__} from "../../components/Widget__WIDGET_PASCAL_NAME__.tsx";

type Props = {
    contract: unknown;
    runtime: unknown;
    bootstrapData: BootstrapData;
};

export const WidgetView = ({ contract, runtime, bootstrapData }: Props) => {

    const config = readWidgetConfig(contract, runtime);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtime={config.runtime} >
            <Widget__WIDGET_PASCAL_NAME__ config={config} bootstrap={bootstrapData} />
    </SystemStateProvider>
};

