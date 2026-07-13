import { createContext } from "react";
import type { IntentState } from "./type.ts";
import type { IntentEngineState } from "../../integration/intent/types.ts";

export const ENGINE_STORAGE_KEY = 'intent-discovery-state';

export const initialState: IntentEngineState = {
    intentText: '',
    categoryScore: {},
    attributeScore: {},
    productScore: {},
    priceAffinity: {},
    status: 'idle',
    recommendations: [],
    resultCount: 0,
    intentInterpreted: false,
    intentInterpretationReady: false,
    searchReady: false
};

export function loadIntentState(): IntentEngineState {
    // SSR guard
    if (typeof window === 'undefined') {
        return initialState;
    }

    try {
        const raw = localStorage.getItem(ENGINE_STORAGE_KEY);

        if (!raw) {
            return initialState;
        }

        return {
            ...initialState,
            ...JSON.parse(raw)
        };
    } catch {
        return initialState;
    }
}

export function reseIntentState() {
    saveIntentContext(initialState)
}

export function saveIntentContext(context: IntentEngineState) {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(
        ENGINE_STORAGE_KEY,
        JSON.stringify({
            intentText: context.intentText,
            categoryScore: context.categoryScore,
            attributeScore: context.attributeScore,
            priceAffinity: context.priceAffinity
        })
    );
}

export const LocalIntentStateContext = createContext<IntentState | undefined>(undefined);