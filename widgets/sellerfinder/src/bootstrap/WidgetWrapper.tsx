import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./config/Config.ts";
import {TranslationStateProvider} from "./../state/Translation/TranslationStateProvider.tsx"
import {WidgetSellerFinder} from "../components/WidgetSellerFinder.tsx"

type Props = {
    contract: unknown,
    runtime: unknown;
}

export default function WidgetWrapper({contract, runtime}: Props) {
    const activity = useActivityContext();
    const config = readWidgetConfig(contract, runtime, activity);

    return <TranslationStateProvider translations={config.translations}>
        <WidgetSellerFinder config={config} />
    </TranslationStateProvider>
};
