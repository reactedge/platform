import {readWidgetConfig} from "./Config.ts";
import {WidgetCategoryFeatured} from "./components/WidgetCategoryFeatured.tsx";

type Props = {
    contract?: unknown;
};

export const WidgetView = ({ contract }: Props) => {
    const config = readWidgetConfig(contract);

    if (!config) return null;

    return <WidgetCategoryFeatured config={config} />
};

