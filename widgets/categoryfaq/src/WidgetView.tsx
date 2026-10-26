import {readWidgetConfig} from "./Config.ts";
import {WidgetCategoryFaq} from "./components/WidgetCategoryFaq.tsx";

type Props = {
    contract?: unknown;
    bootstrap?: unknown;
};

export const WidgetView = ({ contract, bootstrap }: Props) => {
    const config = readWidgetConfig(contract, bootstrap);

    if (!config) return null;

    return <WidgetCategoryFaq config={config} />
};

