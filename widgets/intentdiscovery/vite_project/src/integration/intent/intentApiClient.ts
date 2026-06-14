import type {AiRecommendationRequest, AiRecommendationResponse} from "../../hooks/infra/useAiRecommendations.tsx";
import type {AiInterpretationRequest, AiInterpretationResponse} from "../../hooks/infra/useAiInterpreter.tsx";
import {activity} from "../../activity";

export interface IntentApiClientConfig {
    baseUrl: string;
    store: string;
}

export interface IntentApiClient {
    suggest(payload: AiRecommendationRequest): Promise<AiRecommendationResponse>;
    interpret(payload: AiInterpretationRequest): Promise<AiInterpretationResponse>;
    dummy(payload: AiInterpretationRequest): Promise<AiInterpretationResponse>;
}

export const createIntentApiClient = (
    config: IntentApiClientConfig
): IntentApiClient => {
    const { baseUrl, store } = config;

    const call = async (path: string, payload: unknown) => {
        activity('ai-engine', 'AI Engine payload', payload)
        const response = await fetch(`${baseUrl}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Store": store
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            activity('ai-engine', 'AI Engine failed',null, 'error')
            throw new Error(`Intent API request failed: ${path}`);
        }

        const result = response.json()

        return result;
    };

    return {
        suggest: (payload) => call("/intent/suggest", payload),
        interpret: (payload) => call("/intent/interpret", payload),
        dummy: (payload) => call("/intent/dummy", payload),
    };
};
