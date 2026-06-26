import {type ReactNode, useState} from "react";
import {LocalConfigStateContext} from "./ConfigState.tsx";
import type {MegaMenuSettingsConfig} from "../../domain/megamenu.types.ts";

interface ConfigStateProviderProps {
    children: ReactNode;
    settings: MegaMenuSettingsConfig | undefined;
}

const LocalStateProvider = LocalConfigStateContext.Provider;

export const ConfigStateProvider: React.FC<ConfigStateProviderProps> = ({ children, settings }) => {
    const [state] = useState<{ settings: MegaMenuSettingsConfig | undefined }>({
        settings
    });

    return (
        <LocalStateProvider
            value={{
                settings: state.settings,
            }}
        >
            {children}
        </LocalStateProvider>
    );
};
