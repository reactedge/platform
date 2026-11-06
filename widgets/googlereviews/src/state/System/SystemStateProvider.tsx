import {type ReactNode} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import type {WidgetActivity} from "@reactedge/framework/activity";
import type {WidgetConfig} from "../../bootstrap/config/Config.ts";
interface SystemStateProviderProps {
    children: ReactNode;
    config: WidgetConfig;
    activity?: WidgetActivity
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