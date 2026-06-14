import {createContext} from "react";
import type {UserState} from "./type.ts";

export const LocalUserStateContext = createContext<UserState | undefined>(undefined);