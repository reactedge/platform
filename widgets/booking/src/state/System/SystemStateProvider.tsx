import {type ReactNode, useMemo} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import {createGraphqlClient} from "../../lib/graphql.ts";
import type {BookingWidgetConfig} from "../../BookingSystemConfig.tsx";

interface SystemStateProviderProps {
    children: ReactNode;
    config: BookingWidgetConfig;
}

const LocalStateProvider = LocalSystemStateContext.Provider;

export const SystemStateProvider: React.FC<SystemStateProviderProps> = ({ children, config }) => {
    if (!config?.api) {
        throw new Error('GraphQL client cannot be created without API endpoint');
    }

    const graphqlClient = useMemo(
        () => createGraphqlClient(config.api),
        [config.api]
    );

    const isTurnstileEnabled = () => {
        return Boolean(config.cloudflareKey);
    }

    return (
        <LocalStateProvider
            value={{
                cloudflareKey: config.cloudflareKey || '',
                graphqlClient,
                isTurnstileEnabled
            }}
        >
            {children}
        </LocalStateProvider>
    );
};
