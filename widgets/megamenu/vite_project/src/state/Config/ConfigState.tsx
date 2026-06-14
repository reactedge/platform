import {createContext} from "react";
import type {ConfigState} from "./type.ts";

export const LocalConfigStateContext = createContext<ConfigState | undefined>(undefined);