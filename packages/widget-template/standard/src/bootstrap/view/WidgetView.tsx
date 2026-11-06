import {readWidgetConfig} from "../config/Config.ts";
import {Widget__WIDGET_PASCAL_NAME__} from "./components/Widget__WIDGET_PASCAL_NAME__.tsx";

type Props = {
    contract?: unknown;
};

export const WidgetView = ({ contract }: Props) => {
    const config = readWidgetConfig(contract);

    if (!config) return null;

    return <Widget__WIDGET_PASCAL_NAME__ config={config} />
};

