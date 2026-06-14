import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {IntentLookup} from "./components/IntentLookup.tsx";
import {TranslationStateProvider} from "./state/Translation/TranslationStateProvider.tsx";
import {SpinnerOverlay} from "./components/global/SpinnerOverlay.tsx";
import {IntentStateProvider} from "./state/Intent/IntentStateProvider.tsx";
import {useEffect, useState} from "react";
import {type WidgetConfig, readWidgetConfig} from "./IntentDiscoveryConfig.ts";
import type {ReactEdgeRuntimeConfig} from "./domain/intent-discovery.types.ts";

type Props = {
    rawConfig: WidgetConfig;
    runtimeConfig: ReactEdgeRuntimeConfig;
};

export const IntentDiscoveryWidgetWrapper = ({ rawConfig, runtimeConfig }: Props) => {
    const [bootReady, setBootReady] = useState(false);
    const config = readWidgetConfig(rawConfig, runtimeConfig);

    useEffect(() => {
        if (!config) return;

        // delay first meaningful render
        requestAnimationFrame(() => {
            setBootReady(true);
        });
    }, [config]);

    if (!config) return null;

    return  <SystemStateProvider config={config.integrations} runtimeConfig={config.runtime}>
                <IntentStateProvider config={config.data}>
                    <TranslationStateProvider translations={config.translations}>
                        <div className="intent-widget-container">
                            {!bootReady
                                ? <SpinnerOverlay/>
                                : <IntentLookup config={config} />
                            }
                        </div>
                    </TranslationStateProvider>
                </IntentStateProvider>
    </SystemStateProvider>
};

