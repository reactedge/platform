import {useContext} from "react";
import {LocalUserStateContext} from "./UserState.tsx";
import type {UserState} from "./type.ts";

export function useUserState(): UserState {
    const context = useContext(LocalUserStateContext);
    if (!context) {
        throw new Error("useUserState must be used within UserStateProvider");
    }
    return context;
}