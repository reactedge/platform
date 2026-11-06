import {readWidgetConfig} from "../config/Config.ts";
import {MegamenuContent} from "../../components/MobileMegamenu/MenuContent.tsx";
import {ConfigStateProvider} from "../../state/Config/ConfigStateProvider.tsx";

type Props = {
    contract: unknown;
    bootstrap: unknown;
};

export const WidgetView = ({ contract, bootstrap }: Props) => {
    const config = readWidgetConfig(contract, bootstrap);

    if (!config) return null;

    return <ConfigStateProvider settings={config?.settings?.theme}>
        <MegamenuContent items={config?.data.items} theme={config.settings?.theme} />
    </ConfigStateProvider>
};

