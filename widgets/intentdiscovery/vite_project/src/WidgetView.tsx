import React from 'react';
import {type WidgetConfig, readWidgetConfig} from "./IntentDiscoveryConfig.ts";
import {IntentStateProvider} from "./state/Intent/IntentStateProvider.tsx";
import {TranslationStateProvider} from "./state/Translation/TranslationStateProvider.tsx";
import {IntentLookup} from "./components/IntentLookup.tsx";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import type {ReactEdgeRuntimeConfig} from "./domain/intent-discovery.types.ts";
import type {BootstrapData} from "./ssr/entry.tsx";

type Props = {
    rawConfig: WidgetConfig;
    runtimeConfig: ReactEdgeRuntimeConfig
    bootstrapData: BootstrapData
};

export const WidgetView = ({ rawConfig, runtimeConfig, bootstrapData }: Props) => {
    const config = readWidgetConfig(rawConfig, runtimeConfig);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtimeConfig={config.runtime} bootstrap={bootstrapData}>
        <IntentStateProvider config={config.data}>
            <TranslationStateProvider translations={config.translations}>
                <div className="intent-widget-container">
                    <IntentLookup config={config} />
                </div>
            </TranslationStateProvider>
        </IntentStateProvider>
    </SystemStateProvider>
};

