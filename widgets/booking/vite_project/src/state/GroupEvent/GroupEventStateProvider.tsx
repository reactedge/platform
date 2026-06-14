import {type ReactNode, useCallback, useEffect} from "react";
import { useImmer } from "use-immer";
import {LocalGroupEventStateContext, readActiveGroupEvent} from "./GroupEventState.tsx";
import type {GroupEventInfoState} from "./type.ts";
import {groupEventHash} from "../../domain/event/getGroupEventStatus.ts";

const LocalStateProvider = LocalGroupEventStateContext.Provider;

interface GroupEventStateProviderProps {
    children: ReactNode;
}

export const GroupEventStateProvider: React.FC<GroupEventStateProviderProps> = ({ children }) => {
    const [state, setState] = useImmer<{ eventGroupState: GroupEventInfoState }>({
        eventGroupState: readActiveGroupEvent(),
    });

    // ✅ Keep state in sync with `localStorage` (Fixes Next.js navigation reset issue)
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("eventGroupState", JSON.stringify(state.eventGroupState));
        }
    }, [state.eventGroupState]);

    const updateGroupState = useCallback(
        <K extends keyof GroupEventInfoState>(
            key: K,
            value: GroupEventInfoState[K]
        ) => {
            setState(draft => {
                draft.eventGroupState[key] = value;
            });
        },
        []
    );

    const toggleActiveGroupEvent = useCallback((eventIds: string[]) => {
        const hash = groupEventHash(eventIds);
        updateGroupState("activeGroupEventHash", hash);
    }, [updateGroupState]);

    const resetActiveGroupEvent = useCallback(() => {
        updateGroupState("activeGroupEventHash", undefined);
    }, [setState]);

    return <LocalStateProvider
        value={{
            resetActiveGroupEvent,
            toggleActiveGroupEvent,
            groupEventState: state.eventGroupState
        }}
    >{children}</LocalStateProvider>
}
