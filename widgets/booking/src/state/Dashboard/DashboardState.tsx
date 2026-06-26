import {createContext} from "react";
import type {DashboardState} from "./type.ts";

export const LocalDashboardStateContext = createContext<DashboardState | undefined>(undefined);