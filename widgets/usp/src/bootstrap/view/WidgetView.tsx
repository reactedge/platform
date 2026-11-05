import {readWidgetConfig} from "../config/Config.ts";
import {UspWidget} from "../../components/UspWidget.tsx";

type Props = {
    contract?: unknown;
    bootstrap?: unknown
};

export const WidgetView = ({ contract }: Props) => {
    const config = readWidgetConfig(contract);

    if (!config) return null;

    return <UspWidget config={config} />
};

