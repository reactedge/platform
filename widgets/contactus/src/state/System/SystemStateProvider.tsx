import {type ReactNode} from "react";
import {LocalSystemStateContext} from "./SystemState.tsx";
import type {ContactUsConfig} from "../../domain/contact.types.ts";

interface SystemStateProviderProps {
    children: ReactNode;
    config: ContactUsConfig;
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
