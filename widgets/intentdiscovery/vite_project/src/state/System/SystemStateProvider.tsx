import React from "react";
import {type ReactNode, useMemo} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import type {
    ReactEdgeRuntimeIntegrations,
    ResolvedRuntimeConfig
} from "../../domain/intent-discovery.types.ts";
import {createIntentEngine} from "../../integration/intent/IntentEngine.ts";
import {createIntentApiClient} from "../../integration/intent/intentApiClient.ts";
import {createGraphqlService} from "../../services/graphql/graphql.service.ts";
import type {BootstrapData} from "../../ssr/entry.tsx";

interface SystemStateProviderProps {
    children: ReactNode;
    config: ReactEdgeRuntimeIntegrations;
    runtimeConfig: ResolvedRuntimeConfig;
    bootstrap?: BootstrapData
}

const LocalStateProvider = LocalSystemStateContext.Provider;

export const SystemStateProvider: React.FC<SystemStateProviderProps> = ({
    children,
    config,
    runtimeConfig,
    bootstrap
}) => {
    if (!config?.magentoGraphql?.api) {
        throw new Error('GraphQL client cannot be created without API endpoint');
    }

    const graphqlClient = useMemo(
        () => createGraphqlService(config.magentoGraphql.api, runtimeConfig.storeCode),
        [config.magentoGraphql?.api, runtimeConfig.storeCode]
    );

    const intentApi = config.intentApi;

    if (!intentApi?.baseUrl) {
        throw new Error('intentApi endpoint is required');
    }

    const intentApiClient = useMemo(() => {
        return createIntentApiClient({
            baseUrl: intentApi.baseUrl,
            store: runtimeConfig.storeCode
        });
    }, [
        intentApi.baseUrl,
        runtimeConfig.storeCode
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
                intentEngine,
                bootstrap
            }}
        >
            {children}
        </LocalStateProvider>
    );
};