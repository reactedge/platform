import {useContext} from "react";
import type {SystemState} from "./type.ts";
import {LocalSystemStateContext} from "./SystemState.tsx";

export function useSystemState(): SystemState {
    const context = useContext(LocalSystemStateContext);
    if (!context) {
        throw new Error("useSystemState must be used within SystemStateProvider");
    }
    return context;
}