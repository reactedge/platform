import type {ReactEdgeRuntimeConfig} from "./domain/regionmap.types.ts";
import {useActivityContext} from "./activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./Config.ts";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {RegionMap} from "./components/RegionMap.tsx";

type Props = {
    rawConfig: unknown;
    runtimeConfig: ReactEdgeRuntimeConfig;
};

export const WidgetWrapper = ({ rawConfig, runtimeConfig}: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(rawConfig, runtimeConfig, activity);

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
            <RegionMap {...props} />
        </SystemStateProvider>
    );
};

