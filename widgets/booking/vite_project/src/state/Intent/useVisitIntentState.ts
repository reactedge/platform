import {useContext} from "react";
import {LocalVisitIntentStateContext} from "./VisitIntentState.tsx";
import type {VisitIntentState} from "./type.ts";

export function useVisitIntentState(): VisitIntentState {
    const context = useContext(LocalVisitIntentStateContext);
    if (!context) {
        throw new Error("useVisitIntentState must be used within VisitIntentStateProvider");
    }
    return context;
}