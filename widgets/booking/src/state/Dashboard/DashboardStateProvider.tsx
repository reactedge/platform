import {type ReactNode, useCallback} from "react";
import { useImmer } from "use-immer";
import {LocalDashboardStateContext} from "./DashboardState.tsx";
import type {DashboardInfoState} from "./type.ts";

const LocalStateProvider = LocalDashboardStateContext.Provider;

const intialState: DashboardInfoState = {
    versionNumber: 0,
    lastBookedEventId: null
}

interface DashboardStateProviderProps {
    children: ReactNode;
}

export const DashboardStateProvider: React.FC<DashboardStateProviderProps> = ({ children }) => {
    const [state, setState] = useImmer<DashboardInfoState>(intialState);

    const increaseVersionNumber = useCallback(() => {
        setState(draft => { draft.versionNumber++ });
    },[setState]);

    const setLastBookedEventId = useCallback((eventId: string) => {
        setState(draft => { draft.lastBookedEventId = eventId });
    },[setState]);

    const resetLastBookedEventId = useCallback(() => {
        setState(draft => { draft.lastBookedEventId = null });
    },[setState]);

    return <LocalStateProvider
        value={{
            increaseVersionNumber,
            setLastBookedEventId,
            resetLastBookedEventId,
            dashboardState: state
        }}
    >{children}</LocalStateProvider>
}
