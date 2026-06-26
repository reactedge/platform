import { useContext } from "react";
import { LocalInteractionStateContext } from "./InteractionState.tsx";
import type { InteractionState } from "./type.ts";

export function useInteractionState(): InteractionState {
    const context = useContext(LocalInteractionStateContext);
    if (!context) {
        throw new Error("useInteractionState must be used within InteractionStateProvider");
    }
    return context;
}
