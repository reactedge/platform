import React from 'react';
import type {RawWidgetConfig, ReactEdgeRuntimeConfig} from "./domain/regionmap.types.ts";
import {useActivityContext} from "./activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./Config.ts";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {RegionMap} from "./components/RegionMap.tsx";

type Props = {
    rawConfig: RawWidgetConfig;
    runtimeConfig: ReactEdgeRuntimeConfig;
};

export const WidgetWrapper = ({ rawConfig, runtimeConfig}: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(rawConfig, runtimeConfig, activity);

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
};

