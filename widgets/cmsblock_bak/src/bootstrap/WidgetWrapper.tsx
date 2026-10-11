import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "../Config.ts";
import {useState} from "react";
import {WidgetCmsblock} from "../components/WidgetCmsblock.tsx";

type Props = {
    contract: unknown,
    runtime: unknown;
    bootstrap?: unknown
}

export default function WidgetWrapper({contract, runtime}: Props) {
    const activity = useActivityContext()
    const [bootReady, setBootReady] = useState(false);
    const config = readWidgetConfig(contract, runtime, activity);

    if (!config) return null;

    return <WidgetCmsblock config={config} />
}