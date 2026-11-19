import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./config/Config.ts";
import {WidgetEVChargerFinder} from "../components/WidgetEVChargerFinder.tsx";
import {TranslationStateProvider} from "./../state/Translation/TranslationStateProvider.tsx"
import {SystemStateProvider} from "../state/System/SystemStateProvider.tsx";

type Props = {
    contract: unknown,
    runtime: unknown;
}
export default function WidgetWrapper({contract, runtime}: Props) {
    const activity = useActivityContext();
    const config = readWidgetConfig(contract, runtime, activity);

    return <TranslationStateProvider translations={config.translations}>
        <SystemStateProvider config={config}>
            <WidgetEVChargerFinder config={config} />
        </SystemStateProvider>
    </TranslationStateProvider>
};
