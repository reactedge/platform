import {useActivityContext} from "./activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./Config.ts";
import {ProductGalleryWidget} from "./components/ProductGalleryWidget.tsx";
import type {ReactEdgeRuntimeConfig} from "./components/Types.ts";
import {useEffect, useState} from "react";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {SpinnerOverlay} from "./components/global/SpinnerOverlay.tsx";

type Props = {
    rawConfig: unknown,
    runtimeConfig: ReactEdgeRuntimeConfig;
}

export default function WidgetWrapper({rawConfig, runtimeConfig}: Props) {
    const activity = useActivityContext()
    const [bootReady, setBootReady] = useState(false);
    const config = readWidgetConfig(rawConfig, runtimeConfig, activity);

    useEffect(() => {
        if (!config) return;

        // delay first meaningful render
        requestAnimationFrame(() => {
            setBootReady(true);
        });
    }, [config]);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtimeConfig={config.runtime} activity={activity}>
        {!bootReady
            ? <SpinnerOverlay/>
            : <ProductGalleryWidget config={config} />
        }
    </SystemStateProvider>
}