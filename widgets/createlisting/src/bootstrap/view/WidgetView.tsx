import type {BootstrapData} from "../ssr/render.tsx";
import {readWidgetConfig} from "../config/Config.ts";
import {WidgetCreatelisting} from "../../components/WidgetCreatelisting.tsx";

type Props = {
    contract: unknown;
    runtime: unknown;
    bootstrapData: BootstrapData;
};

export const WidgetView = ({ contract, runtime }: Props) => {

    const config = readWidgetConfig(contract, runtime);

    if (!config) return null;

    return <WidgetCreatelisting config={config} />;
};
