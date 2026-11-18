import {UspvWidget} from "../components/UspvWidget.tsx";
import {readWidgetConfig} from "./config/Config.ts";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {TranslationStateProvider} from "../state/Translation/TranslationStateProvider.tsx";

type Props = {
    contract?: unknown
    bootstrap?: unknown
};

export const WidgetWrapper = ({ contract }: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, activity);

    if (!config) return null;

    return <TranslationStateProvider translations={config.translations}>
        <UspvWidget config={config} />
    </TranslationStateProvider>
};

