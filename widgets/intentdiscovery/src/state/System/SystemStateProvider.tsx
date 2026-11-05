import React from "react";
import { type ReactNode, useMemo } from "react";
import { LocalSystemStateContext } from "./SystemState.tsx";
import type { WidgetActivity } from "@reactedge/framework/activity";
import type { ResolvedConfigIntegrations } from "../../bootstrap/config/Config.ts";
import type { ResolvedRuntimeConfig } from "../../types/domain/intent-discovery.types.ts"
import { createGraphqlService } from "@reactedge/framework/graphql/graphql.service.ts";
import { createIntentEngine } from "../../integration/intent/IntentEngine.ts";
import { createIntentApiClient } from "../../integration/intent/intentApiClient.ts";

interface SystemStateProviderProps {
    children: ReactNode;
    config: ResolvedConfigIntegrations;
    runtime: ResolvedRuntimeConfig;
    activity?: WidgetActivity;
}

const LocalStateProvider = LocalSystemStateContext.Provider;

export const SystemStateProvider: React.FC<SystemStateProviderProps> = ({
    children,
    config,
    runtime,
    activity
}) => {
    if (!config?.magentoGraphql?.api) {
        throw new Error('GraphQL client cannot be created without API endpoint');
    }

    const graphqlClient = useMemo(
        () => createGraphqlService(config.magentoGraphql.api, runtime.storeCode, activity),
        [config.magentoGraphql?.api, runtime.storeCode, activity]
    );

    const intentApi = config.intentApi;

    if (!intentApi?.baseUrl) {
        throw new Error('intentApi endpoint is required');
    }

    const intentApiClient = useMemo(() => {
        return createIntentApiClient({
            baseUrl: intentApi.baseUrl,
            store: runtime.storeCode
        }, activity);
    }, [
        intentApi.baseUrl,
        runtime.storeCode,
        activity
    ]);

    // ✅ One single engine instance
    const intentEngine = useMemo(
        () => createIntentEngine({
            intentApiClient
        }),
        [intentApiClient]
    );

    return (
        <LocalStateProvider
            value={{
                graphqlClient,
                intentEngine
            }}
        >
            {children}
        </LocalStateProvider>
    );
};