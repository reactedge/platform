import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./config/Config.ts";
import {SystemStateProvider} from "../state/System/SystemStateProvider.tsx";
import {TranslationStateProvider} from "../state/Translation/TranslationStateProvider.tsx";
import {WidgetGooglereviews} from "../components/WidgetGooglereviews.tsx";

type Props = {
    contract: unknown,
    runtime: unknown;
}

export default function WidgetWrapper({contract, runtime}: Props) {
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, runtime, activity);

    if (!config) return null;

    return <TranslationStateProvider translations={config.translations}>
        <SystemStateProvider config={config}>
            <WidgetGooglereviews config={config} />
        </SystemStateProvider>
    </TranslationStateProvider>
}