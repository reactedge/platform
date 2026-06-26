import {createContext} from "react";
import type {TranslationState} from "./type.ts";

export const LocalTranslationStateContext = createContext<TranslationState | undefined>(undefined);