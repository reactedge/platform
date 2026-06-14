import { createContext } from "react";
import type {InteractionInfoState, InteractionState} from "./type.ts";
import type {IntentEngineState} from "../../integration/intent/types.ts";

export const INTERACTION_STORAGE_KEY = 'intent-discovery-interaction';

const DEFAULT_INTERACTION_STATE: InteractionInfoState = {
    navigation: {
        activeAttribute: null
    },
    selection: {
        selectedOptions: []
    }
};

export const readInteraction = (): InteractionInfoState => {
    // SSR guard
    if (typeof window === 'undefined') {
        return DEFAULT_INTERACTION_STATE;
    }

    try {
        const raw = localStorage.getItem(INTERACTION_STORAGE_KEY);

        const persisted = raw
            ? JSON.parse(raw)
            : null;

        return {
            navigation: {
                activeAttribute:
                    persisted?.activeAttribute ?? null
            },
            selection: {
                selectedOptions: []
            }
        };
    } catch {
        return DEFAULT_INTERACTION_STATE;
    }
};

export function saveContext(context: IntentEngineState) {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(INTERACTION_STORAGE_KEY, JSON.stringify(context))
}

export const LocalInteractionStateContext = createContext<InteractionState | undefined>(undefined);
