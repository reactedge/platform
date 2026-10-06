import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "../Config.ts";
import {useEffect, useState} from "react";
import {SystemStateProvider} from "../state/System/SystemStateProvider.tsx";
import {SpinnerOverlay} from "../components/global/SpinnerOverlay.tsx";
import {WidgetCreateproduct} from "../components/WidgetCreateproduct.tsx";

type Props = {
    contract: unknown,
    runtime: unknown;
}

export default function WidgetWrapper({contract, runtime}: Props) {
    const activity = useActivityContext()
    const [bootReady, setBootReady] = useState(false);
    const config = readWidgetConfig(contract, runtime, activity);

    useEffect(() => {
        if (!config) return;

        // delay first meaningful render
        requestAnimationFrame(() => {
            setBootReady(true);
        });
    }, [config]);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtime={config.runtime} activity={activity}>
                {!bootReady
                    ? <SpinnerOverlay/>
                    : <WidgetCreateproduct config={config} />
                }
    </SystemStateProvider>
}