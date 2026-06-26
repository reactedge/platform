import {type MergedAttribute} from "../../hooks/infra/useMagentoLayeredData.tsx";
import type {AiRecommendationResponse} from "../../hooks/infra/useAiRecommendations.tsx";
import type {AttributeFilters} from "../../integration/intent/types.ts";
import type {GraphqlProduct} from "../../types/infra/magento/product.types.ts";
import type {IntentApiClient} from "../../integration/intent/intentApiClient.ts";
import {enrichSuggestions} from "../mappers/suggestions/enrichSuggestions.ts";
import {buildAiRecommendationPayload} from "../../lib/ai-recommendations.ts";
import type {OptionLabelMap} from "../../domain/intent-discovery.types.ts";

export async function fetchRecommendations({
   attributeScore,
   attributes,
   products,
   optionLabelMap,
   intentApiClient
}: {
    attributeScore: AttributeFilters
    attributes: MergedAttribute[]
    products: GraphqlProduct[]
    optionLabelMap: OptionLabelMap
    intentApiClient: IntentApiClient
}): Promise<AiRecommendationResponse> {

    if (
        !attributeScore ||
        Object.keys(attributeScore).length === 0 ||
        !attributes?.length ||
        !products?.length
    ) {
        return { suggestions: [] }
    }

    const payload = buildAiRecommendationPayload(
        attributeScore,
        products,
        optionLabelMap
    )

    const json = await intentApiClient.suggest(payload)

    const enriched = enrichSuggestions(
        json.suggestions ?? [],
        products,
        optionLabelMap
    )

    return { suggestions: enriched }
}