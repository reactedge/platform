import {type ReactNode, useCallback, useEffect} from "react";
import { useImmer } from "use-immer";
import type {ConfigInfoState} from "./type.ts";
import {LocalConfigStateContext} from "./ConfigState.tsx";
import type {Venue} from "../../types/domain/types.ts";
import type {EventHost} from "../../types/domain/event.type.ts";

interface ConfigStateProviderProps {
    children: ReactNode;
    config: ConfigInfoState;
}

const LocalStateProvider = LocalConfigStateContext.Provider;

export const ConfigStateProvider: React.FC<ConfigStateProviderProps> = ({ children, config }) => {
    const [state, setState] = useImmer<{ config: ConfigInfoState }>({
        config
    });

    // ✅ Keep state in sync with `localStorage` (Fixes Next.js navigation reset issue)
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("bookingSystemConfig", JSON.stringify(state.config));
        }
    }, [state.config]);

    const updateConfig = useCallback(
        <K extends keyof ConfigInfoState>(
            key: K,
            value: ConfigInfoState[K]
        ) => {
            setState(draft => {
                draft.config[key] = value;
            });
        },
        [setState]
    );

    const getEventHostIds = useCallback((): string[] => {
        return state.config.eventHosts.map(h => h.id);
    }, [state.config.eventHosts]);

    const setVenue = useCallback((value: Venue) => {
        updateConfig("venue", value);
    }, [updateConfig]);

    const setEventHosts = useCallback((value: EventHost[]) => {
        updateConfig("eventHosts", value);
    }, [updateConfig]);

    return (
        <LocalStateProvider
            value={{
                setVenue,
                setEventHosts,
                getEventHostIds,
                config: state.config,
            }}
        >
            {children}
        </LocalStateProvider>
    );
};
