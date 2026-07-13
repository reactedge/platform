import React from "react";
import {type ReactNode, useMemo} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import {createGraphqlService} from "../../services/graphql/graphql.service.ts";
import type {WidgetActivity} from "../../activity";
import type {ResolvedConfigIntegrations, RuntimeConfig} from "../../components/Types.ts";

interface SystemStateProviderProps {
    children: ReactNode;
    config: ResolvedConfigIntegrations;
    runtimeConfig: RuntimeConfig;
    activity?: WidgetActivity
}

const LocalStateProvider = LocalSystemStateContext.Provider;

export const SystemStateProvider: React.FC<SystemStateProviderProps> = ({
    children,
    config,
    runtimeConfig,
    activity
}) => {
    if (!config?.magentoGraphql?.api) {
        throw new Error('GraphQL client cannot be created without API endpoint');
    }

    const graphqlClient = useMemo(
        () => createGraphqlService(config.magentoGraphql.api, runtimeConfig.storeCode, activity),
        [config.magentoGraphql?.api, runtimeConfig.storeCode]
    );

    return (
        <LocalStateProvider
            value={{
                graphqlClient
            }}
        >
            {children}
        </LocalStateProvider>
    );
};