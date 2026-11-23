import {useContext} from "react";
import type {TranslationState} from "./type.ts";
import {LocalTranslationStateContext} from "./TranslationState.tsx";

export function useTranslationState(): TranslationState {
    const context = useContext(LocalTranslationStateContext);
    if (!context) {
        throw new Error("useTranslationState must be used within TranslationStateProvider");
    }
    return context;
}