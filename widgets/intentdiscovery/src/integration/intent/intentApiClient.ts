import type { AiRecommendationRequest, AiRecommendationResponse } from "../../types/domain/ai.recommendations.types.ts"
import type { AiInterpretationRequest, AiInterpretationResponse } from "../../types/domain/ai.interpretation.types.ts";
import type { WidgetActivity } from "@reactedge/framework/activity";

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
    config: IntentApiClientConfig,
    activity?: WidgetActivity
): IntentApiClient => {
    const { baseUrl, store } = config;

    const call = async (path: string, payload: unknown) => {
        activity?.log('ai-engine', 'AI Engine payload', payload)
        const response = await fetch(`${baseUrl}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Store": store,
                "X-Correlation-Id": activity?.getCorrelationId() || ''
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            activity?.log('ai-engine', 'AI Engine failed', null, 'error')
            throw new Error(`Intent API request failed: ${path}`);
        }

        const result = response.json()

        return result;
    };

    return {
        suggest: (payload) => call("/v1/intent/suggest", payload),
        interpret: (payload) => call("/v1/intent/interpret", payload),
        dummy: (payload) => call("/v1/intent/dummy", payload),
    };
};
