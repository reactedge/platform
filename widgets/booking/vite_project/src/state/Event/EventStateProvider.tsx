import {type ReactNode, useCallback, useEffect} from "react";
import { useImmer } from "use-immer";
import {LocalEventStateContext, readActiveEvent} from "./EventState.tsx";
import type {EventInfoState} from "./type.ts";

const LocalStateProvider = LocalEventStateContext.Provider;

interface EventStateProviderProps {
    children: ReactNode;
}

export const EventStateProvider: React.FC<EventStateProviderProps> = ({ children }) => {
    const [state, setState] = useImmer<{ eventState: EventInfoState }>({
        eventState: readActiveEvent(),
    });

    // ✅ Keep state in sync with `localStorage` (Fixes Next.js navigation reset issue)
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("eventState", JSON.stringify(state.eventState));
        }
    }, [state.eventState]);

    const updateState = useCallback(
        <K extends keyof EventInfoState>(
            key: K,
            value: EventInfoState[K]
        ) => {
            setState(draft => {
                draft.eventState[key] = value;
            });
        },
        []
    );

    const showBooking = () => {
        updateState('drawerContent', 'booking');
    };

    const showSignIn = () => {
        updateState('drawerContent', 'signin');
    };

    const showSignUp = () => {
        updateState('drawerContent', 'signup');
    };

    const toggleActiveEvent = useCallback((value: string) => {
        updateState("activeEventId", value);
    }, [updateState]);

    const resetActiveEvent = useCallback(() => {
        updateState("activeEventId", undefined);
    }, [updateState]);

    const toggleShampooEvent = useCallback(() => {
        setState(draft => {
            draft.eventState['shampoo'] = !draft.eventState['shampoo'];
        });
    }, [updateState]);

    return <LocalStateProvider
        value={{
            showBooking,
            showSignIn,
            showSignUp,
            resetActiveEvent,
            toggleActiveEvent,
            toggleShampooEvent,
            eventState: state.eventState
        }}
    >{children}</LocalStateProvider>
}
