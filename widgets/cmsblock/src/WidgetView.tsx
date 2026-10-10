import {readWidgetConfig} from "./Config.ts";
import {WidgetCmsblock} from "./components/WidgetCmsblock.tsx";

type Props = {
    contract?: unknown;
};

export const WidgetView = ({ contract }: Props) => {
    const config = readWidgetConfig(contract);

    if (!config) return null;

    return <WidgetCmsblock config={config} />
};

