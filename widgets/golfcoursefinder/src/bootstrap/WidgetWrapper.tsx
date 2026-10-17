import { useActivityContext } from "../activity/Context/useActivityContext.ts";
import { readWidgetConfig } from "../Config.ts";
import { TranslationStateProvider } from "../state/Translation/TranslationStateProvider.tsx";
import { SystemStateProvider } from "../state/System/SystemStateProvider.tsx";
import { WidgetGolfcoursefinder } from "../components/WidgetGolfcoursefinder.tsx";

type Props = { contract: unknown; runtime: unknown };

export default function WidgetWrapper({ contract, runtime }: Props) {
    const activity = useActivityContext();
    const config = readWidgetConfig(contract, runtime, activity);
    return (
        <TranslationStateProvider translations={config.translations}>
            <SystemStateProvider config={config}>
                <WidgetGolfcoursefinder config={config} />
            </SystemStateProvider>
        </TranslationStateProvider>
    );
}
