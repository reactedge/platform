import {useContext} from "react";
import type {ConfigState} from "./type.ts";
import {LocalConfigStateContext} from "./ConfigState.tsx";

export function useConfigState(): ConfigState {
    const context = useContext(LocalConfigStateContext);
    if (!context) {
        throw new Error("useConfigState must be used within ConfigStateProvider");
    }
    return context;
}