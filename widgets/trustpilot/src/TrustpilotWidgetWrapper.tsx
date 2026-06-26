import {useWidgetConfig} from "./hooks/useWidgetConfig.ts";
import {TrustpilotReviews} from "./components/TrustpilotReviews.tsx";
import {Spinner} from "./components/global/Spinner.tsx";
import {ErrorState} from "./components/global/ErrorState.tsx";
import {TranslationStateProvider} from "./state/Translation/TranslationStateProvider.tsx";
import {SystemStateProvider} from "./state/System/SystemStateProvider.tsx";

type Props = {
    host: HTMLElement;
};

export const TrustpilotWidgetWrapper = ({ host }: Props) => {
    const {config, error, loading} = useWidgetConfig(host);

    if (!config) return null;
    if (error) return <ErrorState />
    if (loading) return <Spinner />

    return (
        <TranslationStateProvider translations={config.translations}>
            <SystemStateProvider config={config}>
                <TrustpilotReviews config={config} />
            </SystemStateProvider>
        </TranslationStateProvider>
    );
};

