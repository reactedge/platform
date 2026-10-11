import React, { useMemo, type ReactNode } from "react";
import { LocalSystemStateContext } from "./SystemState.tsx";
import type { WidgetActivity } from "@reactedge/framework/activity";
import type {
    CmsBlockApiIntegration,
    RuntimeConfig,
} from "../../Config.ts";
import { createCmsBlockApiClient } from "../../services/cmsblock/CmsBlockApi.ts";

interface SystemStateProviderProps {
    children: ReactNode;
    config: { readonly cmsblockApi: CmsBlockApiIntegration };
    runtime: RuntimeConfig;
    activity?: WidgetActivity;
}

const LocalStateProvider = LocalSystemStateContext.Provider;

export const SystemStateProvider: React.FC<SystemStateProviderProps> = ({
    children,
    config,
}) => {
    const cmsBlockApi = useMemo(() => {
        const api = config?.cmsblockApi?.api;
        if (!api) {
            throw new Error("CMSBlock API client cannot be created without an API endpoint.");
        }
        return createCmsBlockApiClient(api);
    }, [config?.cmsblockApi?.api]);

    return (
        <LocalStateProvider value={{ cmsBlockApi }}>
            {children}
        </LocalStateProvider>
    );
};
