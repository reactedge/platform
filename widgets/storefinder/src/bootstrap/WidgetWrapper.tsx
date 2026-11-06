import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./config/Config.ts";
import {WidgetStoreFinder} from "../components/WidgetStoreFinder.tsx";
import {TranslationStateProvider} from "./../state/Translation/TranslationStateProvider.tsx"

type Props = {
    contract: unknown,
    runtime: unknown;
}
export default function WidgetWrapper({contract, runtime}: Props) {
    const activity = useActivityContext();
    const config = readWidgetConfig(contract, runtime, activity);

    return <TranslationStateProvider translations={config.translations}>
        <WidgetStoreFinder config={config} />
    </TranslationStateProvider>
};
