import {readWidgetConfig} from "./Config.ts";
import {WidgetImagezoom} from "./components/WidgetImagezoom.tsx";

type Props = {
    contract?: unknown;
};

export const WidgetView = ({ contract }: Props) => {
    const config = readWidgetConfig(contract);

    if (!config) return null;

    return <WidgetImagezoom config={config} />
};

