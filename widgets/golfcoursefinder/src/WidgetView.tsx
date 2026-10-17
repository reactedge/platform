import { readWidgetConfig } from "./Config.ts";
import { WidgetGolfcoursefinder } from "./components/WidgetGolfcoursefinder.tsx";
import { TranslationStateProvider } from "./state/Translation/TranslationStateProvider.tsx";

interface Props {
    readonly contract: unknown;
    readonly runtime: unknown;
}

export function WidgetView({ contract, runtime }: Props) {
    const config = readWidgetConfig(contract, runtime);
    return (
        <TranslationStateProvider translations={config.translations}>
            <WidgetGolfcoursefinder config={config} />
        </TranslationStateProvider>
    );
}
