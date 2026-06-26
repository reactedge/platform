import {useContext} from "react";
import {LocalDashboardStateContext} from "./DashboardState.tsx";
import type {DashboardState} from "./type.ts";

export function useDashboardState(): DashboardState {
    const context = useContext(LocalDashboardStateContext);
    if (!context) {
        throw new Error("useDashboardState must be used within DashboardStateProvider");
    }
    return context;
}