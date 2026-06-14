import React from "react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import {
    initialState,
    loadIntentState,
    LocalIntentStateContext,
    reseIntentState,
    saveIntentContext
} from "./IntentState.tsx";

import type {
    IntentSignal,
    IntentEngineState,
    IntentStatus,
    IntentEvent
} from "../../integration/intent/types.ts";
import { useSystemState } from "../System/useSystemState.ts";
import type { IntentDiscoveryDataConfig } from "../../domain/intent-discovery.types.ts";
import type { MagentoLayeredNavigation } from "../../hooks/domain/useLayeredNavigation.tsx";
import { activity } from "../../activity";
import { parseFiltersFromUrl } from "../../controller/load.ts";
import { intentPersistence } from "../../services/intentPersistence/intentPersistence.service.ts";
import { computeAiReadiness } from "../../domain/intent/readiness.ts";
import { intentReducer } from "./intent.reducer.ts";
import { runIntentEffects } from "./intent.effects.ts";

interface IntentStateProviderProps {
    children: ReactNode;
    config: IntentDiscoveryDataConfig;
}

const MIN_TEXT_LENGTH = 50
const LocalStateProvider = LocalIntentStateContext.Provider;

export const IntentStateProvider: React.FC<IntentStateProviderProps> = ({ children, config }) => {
    const [intentState, setIntentState] = useState<IntentEngineState>(loadIntentState());
    const { intentEngine } = useSystemState()

    function getAiReadiness(attributeLayerData: MagentoLayeredNavigation) {
        const threshold = config.ai?.matchThreshold ?? MIN_TEXT_LENGTH
        return computeAiReadiness(attributeLayerData, threshold)
    }

    const setPreference = (attributeCode: string, optionValue: string) => {
        setIntentState(prev => {
            const attributeScore = { ...(prev.attributeScore ?? {}) }

            const currentValues = { ...(attributeScore[attributeCode] ?? {}) }

            if (currentValues[optionValue]) {
                // REMOVE (toggle off)
                delete currentValues[optionValue]

                // clean empty attribute (important)
                if (Object.keys(currentValues).length === 0) {
                    delete attributeScore[attributeCode]
                } else {
                    attributeScore[attributeCode] = currentValues
                }
            } else {
                // ADD (toggle on)
                currentValues[optionValue] = 1
                attributeScore[attributeCode] = currentValues
            }

            return {
                ...prev,
                attributeScore
            }
        })
    }

    const resetPreference = () => {
        setIntentState(prev => ({
            ...prev,
            attributeScore: {}
        }))
    }

    const setIntentStatus = (status: IntentStatus) => {
        setIntentState(prev => ({
            ...prev,
            status
        }))
    }

    const resetIntent = () => {
        reseIntentState()
        setIntentState(initialState)
    }

    const setIntentText = (text: string) => {
        setIntentState(prev => ({
            ...prev,
            intentText: text
        }))
    }

    const dispatch = useCallback((event: IntentEvent) => {
        setIntentState(prev => {
            const next = intentReducer(prev, event);
            runIntentEffects(event);
            return next;
        });
    }, []);

    useEffect(() => {
        const allowedAttributes = ["color", "size", "climate", "pattern", "style_general"];

        const filters = parseFiltersFromUrl(
            window.location.search,
            allowedAttributes
        );

        if (Object.keys(filters).length > 0) {
            intentEngine.hydrateFromFilters(filters);
            Object.entries(filters).forEach(([attribute, value]) => {
                const values = Object.keys(value)
                values.forEach(value => {
                    setPreference(attribute, value);
                })
            });
        }

        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<IntentSignal>;

            const signal = customEvent.detail;
            intentEngine.handle(signal);
            setIntentState({ ...intentEngine.getState() });

            const state = intentEngine.getState()
            intentPersistence.save({
                categoryScore: state.categoryScore,
                attributeScore: state.attributeScore
            });
        };

        window.addEventListener("reactedge:intent", handler);

        return () => {
            window.removeEventListener("reactedge:intent", handler);
        };
    }, [intentEngine]);

    useEffect(() => {
        function handleRefresh() {
            if (!intentState.recommendations?.length) return;

            window.dispatchEvent(
                new CustomEvent('reactedge:recommendations', {
                    detail: {
                        recommendations: intentState.recommendations
                    }
                })
            );
        }

        window.addEventListener('reactedge:refresh', handleRefresh);

        return () => {
            window.removeEventListener('reactedge:refresh', handleRefresh);
        };
    }, [intentState.recommendations]);

    useEffect(() => {
        activity('intent-state', 'Intent State Update', intentState);
    }, [intentState.status])

    useEffect(() => {
        saveIntentContext(intentState);
    }, [
        intentState.intentText,
        intentState.attributeScore,
        intentState.categoryScore
    ]);

    return (
        <LocalStateProvider
            value={{
                dispatch,
                intentState,
                getAiReadiness,
                setIntentText,
                setIntentStatus,
                setPreference,
                resetPreference,
                resetIntent
            }}
        >
            {children}
        </LocalStateProvider>
    );
};