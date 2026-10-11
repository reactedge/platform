import {WidgetCmsblock} from "../components/WidgetCmsblock.tsx";
import {readWidgetConfig} from "../Config.ts";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";

type Props = {
    contract: unknown;
    bootstrap: unknown;
    runtime: unknown;
};

export const WidgetWrapper = ({contract, bootstrap, runtime}: Props) => {
    const activity = useActivityContext();
    const config = readWidgetConfig(contract, runtime, activity);
    const viewOnly = typeof bootstrap === "object" && bootstrap !== null &&
        "viewOnly" in bootstrap && bootstrap.viewOnly === true;

    if (!config) return null;

    return <WidgetCmsblock config={config} viewOnly={viewOnly}/>;
};
