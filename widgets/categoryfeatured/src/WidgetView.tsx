import {readWidgetConfig} from "./Config.ts";
import {WidgetCategoryFeatured} from "./components/WidgetCategoryFeatured.tsx";

type Props = {
    contract?: unknown;
    bootstrap?: unknown;
};

export const WidgetView = ({ contract, bootstrap }: Props) => {
    const config = readWidgetConfig(contract, bootstrap);

    if (!config) return null;

    return <WidgetCategoryFeatured config={config} />
};

