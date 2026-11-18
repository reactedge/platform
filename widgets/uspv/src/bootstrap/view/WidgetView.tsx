import {readWidgetConfig} from "../config/Config.ts";
import {UspvWidget} from "../../components/UspvWidget.tsx";
import {TranslationStateProvider} from "../../state/Translation/TranslationStateProvider.tsx";

type Props = {
    contract?: unknown;
};

export const WidgetView = ({ contract }: Props) => {
    const config = readWidgetConfig(contract);

    if (!config) return null;

    return <TranslationStateProvider translations={config.translations}>
        <UspvWidget config={config} />
    </TranslationStateProvider>
};

