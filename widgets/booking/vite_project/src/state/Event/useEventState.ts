import {useContext} from "react";
import {LocalEventStateContext} from "./EventState.tsx";
import type {EventState} from "./type.ts";

export function useEventState(): EventState {
    const context = useContext(LocalEventStateContext);
    if (!context) {
        throw new Error("useEventState must be used within EventStateProvider");
    }
    return context;
}