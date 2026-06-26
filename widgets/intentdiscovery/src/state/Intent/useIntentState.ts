import {useContext} from "react";
import type {IntentState} from "./type.ts";
import {LocalIntentStateContext} from "./IntentState.tsx";

export function useIntentState(): IntentState {
    const context = useContext(LocalIntentStateContext);
    if (!context) {
        throw new Error("useIntentState must be used within IntentStateProvider");
    }
    return context;
}