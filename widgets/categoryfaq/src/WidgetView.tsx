import {readWidgetConfig} from "./Config.ts";
import {WidgetCategoryFaq} from "./components/WidgetCategoryFaq.tsx";

type Props = {
    contract?: unknown;
};

export const WidgetView = ({ contract }: Props) => {
    const config = readWidgetConfig(contract);

    if (!config) return null;

    return <WidgetCategoryFaq config={config} />
};

