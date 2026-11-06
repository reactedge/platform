import { useActivityContext } from "../activity/Context/useActivityContext.ts";
import { readWidgetConfig } from "../Config.ts";
import { SystemStateProvider } from "../state/System/SystemStateProvider.tsx";
import { WidgetBeachfinder } from "../components/WidgetBeachfinder.tsx";

type Props = { contract: unknown; runtime: unknown };

export default function WidgetWrapper({ contract, runtime }: Props) {
    const config = readWidgetConfig(contract, runtime, useActivityContext());
    return (
        <SystemStateProvider config={config.integrations}>
            <WidgetBeachfinder config={config} />
        </SystemStateProvider>
    );
}
