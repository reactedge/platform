import { useActivityContext } from "../activity/Context/useActivityContext.ts";
import { readWidgetConfig } from "../Config.ts";
import { useEffect, useState } from "react";
import { SystemStateProvider } from "../state/System/SystemStateProvider.tsx";
import { SpinnerOverlay } from "../components/global/SpinnerOverlay.tsx";
import { WidgetCmsblock } from "../components/WidgetCmsblock.tsx";
import {
    isCmsBlockBootstrap,
    type CmsBlockBootstrap,
} from "../services/cmsblock/CmsBlockApi.ts";

type Props = {
    contract: unknown;
    runtime: unknown;
    bootstrap?: unknown;
};

export default function WidgetWrapper({ contract, runtime, bootstrap }: Props) {
    const activity = useActivityContext();
    const [bootReady, setBootReady] = useState(false);
    const config = readWidgetConfig(contract, runtime, activity);
    const initialData: CmsBlockBootstrap | undefined = isCmsBlockBootstrap(bootstrap)
        ? bootstrap
        : undefined;

    useEffect(() => {
        const frame = requestAnimationFrame(() => setBootReady(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <SystemStateProvider config={config.integrations} runtime={config.runtime} activity={activity}>
            {!bootReady
                ? <SpinnerOverlay />
                : <WidgetCmsblock config={config} bootstrap={initialData} />}
        </SystemStateProvider>
    );
}
