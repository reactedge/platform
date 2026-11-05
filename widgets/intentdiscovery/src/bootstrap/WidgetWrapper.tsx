import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./config/Config.ts";
import {useEffect, useState} from "react";
import {SystemStateProvider} from "../state/System/SystemStateProvider.tsx";
import {TranslationStateProvider} from "../state/Translation/TranslationStateProvider.tsx";
import {SpinnerOverlay} from "../components/global/SpinnerOverlay.tsx";
import {IntentLookup} from "../components/IntentLookup.tsx"

type Props = {
    contract: unknown,
    bootstrap: unknown,
    runtime: unknown;
}

export default function WidgetWrapper({contract, bootstrap, runtime}: Props) {
    const activity = useActivityContext()
    const [bootReady, setBootReady] = useState(false);
    const config = readWidgetConfig(contract, bootstrap, runtime, activity);

    useEffect(() => {
        if (!config) return;

        // delay first meaningful render
        requestAnimationFrame(() => {
            setBootReady(true);
        });
    }, [config]);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtime={config.runtime} activity={activity}>
            <TranslationStateProvider translations={config.translations}>
                <div className="intent-widget-container">
                    {!bootReady
                        ? <SpinnerOverlay/>
                        : <IntentLookup config={config} />
                    }
                </div>
            </TranslationStateProvider>
    </SystemStateProvider>
}