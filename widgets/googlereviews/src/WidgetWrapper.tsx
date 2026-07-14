import {readWidgetConfig} from "./Config.ts";
import {useActivityContext} from "./activity/Context/useActivityContext.ts";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";
import {GoogleReviews} from "./components/GoogleReviews.tsx";
import {TranslationStateProvider} from "./state/Translation/TranslationStateProvider.tsx";

type Props = {
    rawConfig: unknown;
    runtimeConfig: unknown;
};

export const WidgetWrapper = ({ rawConfig, runtimeConfig}: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(rawConfig, runtimeConfig, activity);

    if (!config) return null;

    return <TranslationStateProvider translations={config.translations}>
        <SystemStateProvider config={config}>
            <GoogleReviews config={config} />
        </SystemStateProvider>
    </TranslationStateProvider>
};

