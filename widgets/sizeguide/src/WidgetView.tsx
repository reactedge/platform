import { readWidgetConfig } from "./Config.ts";
import { WidgetSizeguide } from "./components/WidgetSizeguide.tsx";

type Props = {
    contract?: unknown;
};

export const WidgetView = ({ contract }: Props) => {
    const config = readWidgetConfig(contract);

    if (!config) return null;

    return <WidgetSizeguide config={config} />
};
