import { useActivityContext } from "../activity/Context/useActivityContext.ts";
import { readWidgetConfig } from "../Config.ts";
import { TranslationStateProvider } from "../state/Translation/TranslationStateProvider.tsx";
import { WidgetGolfcoursefinder } from "../components/WidgetGolfcoursefinder.tsx";

type Props = { contract: unknown; runtime: unknown };

export default function WidgetWrapper({ contract, runtime }: Props) {
    const activity = useActivityContext();
    const config = readWidgetConfig(contract, runtime, activity);
    return (
        <TranslationStateProvider translations={config.translations}>
            <WidgetGolfcoursefinder config={config} />
        </TranslationStateProvider>
    );
}
