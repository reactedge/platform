import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {readWidgetConfig} from "./config/Config.ts";
import {useMediaQuery} from "../hooks/ui/useMediaQuery.tsx";
import {ConfigStateProvider} from "../state/Config/ConfigStateProvider.tsx";
import {MegamenuContent} from "../components/MegamenuContent.tsx";
import {MobileMegamenu} from "../components/MobileMegamenu.tsx";

type Props = {
    contract?: unknown
    bootstrap?: unknown
}

export function WidgetWrapper({contract, bootstrap}: Props) {
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, bootstrap, activity);
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (!config) return null;

    return <ConfigStateProvider settings={config?.settings?.theme}>
        {!isMobile && <MegamenuContent items={config?.data.items} theme={config.settings?.theme} />}
        {isMobile && <MobileMegamenu items={config?.data.items} theme={config.settings?.theme} />}
    </ConfigStateProvider>;
}
