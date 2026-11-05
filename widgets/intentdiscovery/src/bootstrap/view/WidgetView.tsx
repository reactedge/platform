import { readWidgetConfig } from "../config/Config.ts";
import { SystemStateProvider } from "../../state/System/SystemStateProvider.tsx";
import { TranslationStateProvider } from "../../state/Translation/TranslationStateProvider.tsx";
import { IntentLookup } from "../../components/IntentLookup.tsx";

type Props = {
    contract: unknown;
    bootstrap: unknown;
    runtime: unknown;
};

export const WidgetView = ({ contract, runtime, bootstrap }: Props) => {

    const config = readWidgetConfig(contract, bootstrap, runtime);

    if (!config) return null;

    return <SystemStateProvider config={config.integrations} runtime={config.runtime}>
        <TranslationStateProvider translations={config.translations}>
            <div className="intent-widget-container">
                <IntentLookup config={config} />
            </div>
        </TranslationStateProvider>
    </SystemStateProvider>
};

