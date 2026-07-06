import {type ReactNode} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import type {WidgetConfig} from "../../domain/contact.types.ts";

interface SystemStateProviderProps {
    children: ReactNode;
    config: WidgetConfig;
}

const LocalStateProvider = LocalSystemStateContext.Provider;

export const SystemStateProvider: React.FC<SystemStateProviderProps> = ({ children, config }) => {
    const isTurnstileEnabled = () => {
        return Boolean(config.cloudflareKey);
    }

    return (
        <LocalStateProvider
            value={{
                cloudflareKey: config.cloudflareKey || '',
                isTurnstileEnabled
            }}
        >
            {children}
        </LocalStateProvider>
    );
};
