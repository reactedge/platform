import type { CmsBlockRecord } from "./services/cmsblock/CmsBlockApi.ts";
import { readWidgetConfig } from "./Config.ts";
import { SystemStateProvider } from "./state/System/SystemStateProvider.tsx";
import { WidgetCmsblock } from "./components/WidgetCmsblock.tsx";

type Props = {
    contract: unknown;
    runtime: unknown;
    bootstrapData?: { record: CmsBlockRecord | null };
};

export const WidgetView = ({ contract, runtime, bootstrapData }: Props) => {
    const config = readWidgetConfig(contract, runtime);

    return (
        <SystemStateProvider config={config.integrations} runtime={config.runtime}>
            <WidgetCmsblock config={config} bootstrap={bootstrapData} />
        </SystemStateProvider>
    );
};
