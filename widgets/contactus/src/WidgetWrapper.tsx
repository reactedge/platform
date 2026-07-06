import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {ContactUsWrapper} from "./components/ContactUsWrapper.tsx";
import type {ReactEdgeRuntimeConfig} from "./domain/contact.types.ts";
import {readWidgetConfig} from "./Config.ts";
import type {RawWidgetConfig} from "./ConfigSchema.ts";
import {useActivityContext} from "./activity/Context/useActivityContext.ts";

type Props = {
    rawConfig: RawWidgetConfig,
    runtimeConfig: ReactEdgeRuntimeConfig
}

export function WidgetWrapper({rawConfig, runtimeConfig}: Props) {
    const activity = useActivityContext()
    const config = readWidgetConfig(rawConfig, runtimeConfig, activity);

    if (!config) return null;

    return <SystemStateProvider config={config}>
        <ContactUsWrapper config={config} />
    </SystemStateProvider>
}
