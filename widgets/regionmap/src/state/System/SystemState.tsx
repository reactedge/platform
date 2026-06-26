import {createContext} from "react";
import type {SystemState} from "./type.ts";

export const LocalSystemStateContext = createContext<SystemState | undefined>(undefined);