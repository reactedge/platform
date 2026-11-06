import {Widget__WIDGET_PASCAL_NAME__} from "../components/Widget__WIDGET_PASCAL_NAME__.tsx";
import {readWidgetConfig} from "./config/Config.ts";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";

type Props = {
    contract?: unknown
    bootstrap?: unknown
};

export const WidgetWrapper = ({ contract }: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, activity);

    if (!config) return null;

    return <Widget__WIDGET_PASCAL_NAME__ config={config} />
};

