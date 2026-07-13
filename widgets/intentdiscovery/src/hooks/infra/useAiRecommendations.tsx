import { useCallback, useEffect, useState } from "react";
import { useSystemState } from "../../state/System/useSystemState.ts";
import { buildAiRecommendationPayload } from "../../lib/ai-recommendations.ts";
import { useOptionLabelMap } from "../domain/useOptionLabelMap.ts";
import type {AttributeFilters} from "../../integration/intent/types.ts";
import type {EnrichedSuggestion, GraphqlProduct} from "../../types/infra/magento/product.types.ts";
import {enrichSuggestions} from "../../services/mappers/suggestions/enrichSuggestions.ts";
import {useIntentState} from "../../state/Intent/useIntentState.ts";
import type {MergedAttribute} from "./useMagentoLayeredData.tsx";
import {useActivityContext} from "../../activity/Context/useActivityContext.ts";

export interface AiRecommendationRequest {
    intent: {
        signals: Record<string, Record<string, number>>
    }
    products: {
        sku: string
        title: string
        shortDescription?: string
        attributes: Record<string, string[]>
    }[]
}

export interface AiRecommendationResponse {
    suggestions: EnrichedSuggestion[] | null
}

export function useAiRecommendations(
    attributeData: MergedAttribute[] | undefined,
    productData: GraphqlProduct[] | undefined,
    enabled: boolean
) {
    const {intentState} = useIntentState()
    const {intentEngine} = useSystemState()
    const { attributeScore } = intentState;

    const [data, setData] = useState<AiRecommendationResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const optionLabelMap = useOptionLabelMap(attributeData);
    const intentApiClient = intentEngine.getApiClient()
    const { dispatch } = useIntentState()
    const activity = useActivityContext()

    async function fetchSuggestions(payload: AiRecommendationRequest) {
        return intentApiClient.suggest(payload);
    }

    const load = useCallback(async (attributeScore: AttributeFilters) => {
        if (!attributeScore || Object.keys(attributeScore).length === 0 || !attributeData?.length || !productData?.length || !enabled) return

        setLoading(true)
        setError(null)

        try {
            const payload = buildAiRecommendationPayload(
                attributeScore,
                productData,
                optionLabelMap
            );
            activity.log('ai-recommendations', 'AI recommendations API payload', payload);

            const json = await fetchSuggestions(payload);
            activity.log('ai-engine', 'AI Engine Recommendations', {json, productData})

            const enriched = enrichSuggestions(
                json.suggestions ?? [],
                productData,
                optionLabelMap
            );

            dispatch( enriched.length > 0 ?
                { type: "SUGGESTION_SUCCESS", recommendations: enriched, filters: attributeScore, intent: intentState.intentText  }:
                { type: "SUGGESTION_EMPTY"}
            );

            setData({ suggestions: enriched ?? [] })
        } catch (err: unknown) {
            activity.log('ai-recommendations', 'AI recommendations Error', {
                error: (err as Error).message
            }, 'error');
            setError(err instanceof Error ? err : new Error("Unknown error"))
        } finally {
            setLoading(false)
        }
    }, [attributeScore, attributeData, productData])

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