import {WidgetCmsblock} from "../components/WidgetCmsblock.tsx";
import {readWidgetConfig} from "../Config.ts";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";

type Props = {
    contract?: unknown
    bootstrap?: unknown
};

export const WidgetWrapper = ({ contract }: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, activity);

    if (!config) return null;

    return <WidgetCmsblock config={config} />
};

