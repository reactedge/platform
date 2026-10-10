import { useEffect, useState, useCallback } from "react";
import { useSystemState } from "../../state/System/useSystemState.ts";
import { buildAiRecommendationPayload } from "../../lib/ai-recommendations.ts";
import { useOptionLabelMap } from "../domain/useOptionLabelMap.ts";
import type { AttributeFilters } from "../../integration/intent/types.ts";
import type { GraphqlProduct } from "../../types/infra/magento/product.types.ts";
import { enrichSuggestions } from "../../services/mappers/suggestions/enrichSuggestions.ts";
import { useIntentState } from "../../state/Intent/useIntentState.ts";
import type { MergedAttribute } from "../../types/infra/magento/attribute.types.ts";
import { useActivityContext } from "../../activity/Context/useActivityContext.ts";
import type {AiRecommendationResponse} from "../../types/domain/ai.recommendations.types.ts"

type RecommendationLoadOptions = {
    attributeScore: AttributeFilters;
    attributeData: MergedAttribute[] | undefined;
    productData: GraphqlProduct[] | undefined;
    enabled: boolean;
    optionLabelMap: ReturnType<typeof useOptionLabelMap>;
    activity: ReturnType<typeof useActivityContext>;
    intentApiClient: ReturnType<ReturnType<typeof useSystemState>['intentEngine']['getApiClient']>;
    dispatch: ReturnType<typeof useIntentState>['dispatch'];
    intentText: string;
    setData: (value: AiRecommendationResponse | null) => void;
    setLoading: (value: boolean) => void;
    setError: (value: Error | null) => void;
};

function hasRecommendationInputs(options: RecommendationLoadOptions): boolean {
    return Object.keys(options.attributeScore).length > 0 &&
        Boolean(options.attributeData?.length) && Boolean(options.productData?.length) && options.enabled;
}

function applyRecommendationResponse(
    options: RecommendationLoadOptions,
    json: AiRecommendationResponse,
): void {
    const {attributeScore, productData, optionLabelMap, activity, intentText, dispatch, setData} = options;
    activity.log('ai-engine', 'AI Engine Recommendations', {json, productData});
    const enriched = enrichSuggestions(json.suggestions ?? [], productData ?? [], optionLabelMap);
    const event = enriched.length > 0
        ? {type: 'SUGGESTION_SUCCESS' as const, recommendations: enriched, filters: attributeScore, intent: intentText}
        : {type: 'SUGGESTION_EMPTY' as const};
    dispatch(event);
    setData({suggestions: enriched});
}

async function loadRecommendations(options: RecommendationLoadOptions): Promise<void> {
    if (!hasRecommendationInputs(options)) return;
    const {attributeScore, productData, optionLabelMap, activity, intentApiClient, setLoading, setError} = options;
    setLoading(true);
    setError(null);
    try {
        const payload = buildAiRecommendationPayload(attributeScore, productData ?? [], optionLabelMap);
        activity.log('ai-recommendations', 'AI recommendations API payload', payload);
        const json = await intentApiClient.suggest(payload);
        applyRecommendationResponse(options, json);
    } catch (error: unknown) {
        activity.log('ai-recommendations', 'AI recommendations Error', {
            error: (error as Error).message,
        }, 'error');
        setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
        setLoading(false);
    }
}

export function useAiRecommendations(
    attributeData: MergedAttribute[] | undefined,
    productData: GraphqlProduct[] | undefined,
    enabled: boolean
) {
    const { intentState } = useIntentState()
    const { intentEngine } = useSystemState()
    const { attributeScore } = intentState;

    const [data, setData] = useState<AiRecommendationResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const optionLabelMap = useOptionLabelMap(attributeData);
    const intentApiClient = intentEngine.getApiClient()
    const { dispatch } = useIntentState()
    const activity = useActivityContext()

    const load = useCallback((score: AttributeFilters) => loadRecommendations({
        attributeScore: score,
        attributeData,
        productData,
        enabled,
        optionLabelMap,
        activity,
        intentApiClient,
        dispatch,
        intentText: intentState.intentText,
        setData,
        setLoading,
        setError,
    }), [
        attributeData,
        productData,
        enabled,
        optionLabelMap,
        activity,
        intentApiClient,
        dispatch,
        intentState.intentText,
    ]);


    useEffect(() => {
        load(attributeScore)
    }, [load, attributeScore])


    return {
        data,
        loading,
        error,
        refetch: load,
    }
}