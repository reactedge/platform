import {useContext} from "react";
import {LocalGroupEventStateContext} from "./GroupEventState.tsx";
import type {GroupEventState} from "./type.ts";

export function useGroupEventState(): GroupEventState {
    const context = useContext(LocalGroupEventStateContext);
    if (!context) {
        throw new Error("useEventState must be used within GroupEventStateProvider");
    }
    return context;
}