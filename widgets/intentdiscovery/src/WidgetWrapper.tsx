import {useEffect, useState} from 'react';
import {readWidgetConfig} from "./Config.ts";
import {useActivityContext} from "./activity/Context/useActivityContext.ts";
import type {ReactEdgeRuntimeConfig} from "./domain/intent-discovery.types.ts";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {IntentStateProvider} from "./state/Intent/IntentStateProvider.tsx";
import {TranslationStateProvider} from "./state/Translation/TranslationStateProvider.tsx";
import {IntentLookup} from "./components/IntentLookup.tsx";
import {SpinnerOverlay} from "./components/global/SpinnerOverlay.tsx";

type Props = {
    rawConfig: unknown;
    runtimeConfig: ReactEdgeRuntimeConfig;
};

export const WidgetWrapper = ({ rawConfig, runtimeConfig }: Props) => {
    const activity = useActivityContext()
    const [bootReady, setBootReady] = useState(false);
    const config = readWidgetConfig(rawConfig, runtimeConfig, activity);

    console.log(config)

    useEffect(() => {
        if (!config) return;

        // delay first meaningful render
        requestAnimationFrame(() => {
            setBootReady(true);
        });
    }, [config]);

    if (!config) return null;

    return  <SystemStateProvider config={config.integrations} runtimeConfig={config.runtime} activity={activity}>
        <IntentStateProvider config={config.data} activity={activity}>
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

