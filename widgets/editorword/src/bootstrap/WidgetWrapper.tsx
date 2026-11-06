import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./config/Config.ts";
import {WidgetWordeditor} from "../components/WidgetWordeditor.tsx";

type Props = {
    contract: unknown,
    runtime: unknown;
}

export default function WidgetWrapper({contract, runtime}: Props) {
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, runtime, activity);

    if (!config) return null;

    return <WidgetWordeditor config={config} />
}