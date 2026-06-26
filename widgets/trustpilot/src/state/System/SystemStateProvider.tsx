import {type ReactNode} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import type {ResolvedTrustpilotConfig} from "../../domain/trustpilot.types.ts";

interface SystemStateProviderProps {
    children: ReactNode;
    config: ResolvedTrustpilotConfig;
}

const LocalStateProvider = LocalSystemStateContext.Provider;

export const SystemStateProvider: React.FC<SystemStateProviderProps> = ({ children, config }) => {
    return (
        <LocalStateProvider
            value={{
                googleMapsApiKey: config.integrations.googleMaps?.apiKey || ''
            }}
        >
            {children}
        </LocalStateProvider>
    );
};
