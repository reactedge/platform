import {RegionMap} from "./components/RegionMap.tsx";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import type {RegionMapWidgetConfig} from "./domain/regionmap.types.ts";
import {readWidgetConfig} from "./RegionMapConfig.ts";

type Props = {
    host: HTMLElement
    rawConfig: RegionMapWidgetConfig | undefined
}

export function RegionMapWidget({host, rawConfig }: Props) {
    const config = readWidgetConfig(host, rawConfig);

    if (!config) return null;

    return (
        <SystemStateProvider config={config}>
            <RegionMap
                title={config.data.title}
                region={config.data.region}
                center={config.data.center}
                zoom={config.data.zoom}
            />
        </SystemStateProvider>
    );
}
