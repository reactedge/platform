import {readWidgetConfig} from "./config/Config.ts";
import {useEffect, useState} from "react";
import {SystemStateProvider} from "../state/System/SystemStateProvider.tsx";
import {SpinnerOverlay} from "../components/global/SpinnerOverlay.tsx";
import {WidgetContactus} from "../components/WidgetContactus.tsx";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";

type Props = {
    contract: unknown,
    bootstrap: unknown,
    runtime: unknown;
}

export default function WidgetWrapper({contract, bootstrap, runtime}: Props) {
    const activity = useActivityContext()
    const [bootReady, setBootReady] = useState(false);
    const config = readWidgetConfig(contract, runtime, bootstrap, activity);

    useEffect(() => {
        if (!config) return;

        // delay first meaningful render
        requestAnimationFrame(() => {
            setBootReady(true);
        });
    }, [config]);

    if (!config) return null;

    return <SystemStateProvider config={config}>
                {!bootReady
                    ? <SpinnerOverlay/>
                    : <WidgetContactus config={config} />
                }
    </SystemStateProvider>
}