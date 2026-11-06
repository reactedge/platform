import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./config/Config.ts";
import {SystemStateProvider} from "../state/System/SystemStateProvider.tsx";
import {WidgetRegionMap} from "../components/WidgetRegionmap.tsx";

type Props = {
    contract: unknown,
    runtime: unknown;
}

export default function WidgetWrapper({contract, runtime}: Props) {
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, runtime, activity);

    if (!config) return null;

    const props = {
        region: config.data.region,
        center: config.data.center,
        zoom: config.data.zoom,
        ...(config.data.title !== undefined
            ? { title: config.data.title }
            : {}),
    };

    return (
        <SystemStateProvider config={config}>
            <WidgetRegionMap {...props} />
        </SystemStateProvider>
    );
};