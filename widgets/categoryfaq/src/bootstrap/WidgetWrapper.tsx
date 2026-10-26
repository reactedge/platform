import {WidgetCategoryFaq} from "../components/WidgetCategoryFaq.tsx";
import {readWidgetConfig} from "../Config.ts";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";

type Props = {
    contract?: unknown
    bootstrap?: unknown
};

export const WidgetWrapper = ({ contract, bootstrap }: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, bootstrap, activity);

    if (!config) return null;

    return <WidgetCategoryFaq config={config} />
};

