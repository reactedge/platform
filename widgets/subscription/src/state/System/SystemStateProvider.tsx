import React from "react";
import {type ReactNode, useMemo} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import type {WidgetActivity} from "@reactedge/framework/activity";
import type {ResolvedConfigIntegrations, RuntimeConfig} from "../../Config.ts";
import {createGraphqlService} from "@reactedge/framework/graphql/graphql.service.ts";

interface SystemStateProviderProps {
    children: ReactNode;
    config: ResolvedConfigIntegrations;
    runtime: RuntimeConfig;
    activity?: WidgetActivity
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