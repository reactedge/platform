
import {fetchRecommendations} from "./fetchRecommendations.ts";
import type {AttributeFilters, IntentEngineState} from "../../integration/intent/types.ts";
import {findProducts} from "./fetchProducts.ts";
import type {MagentoProductFilter} from "../../hooks/domain/useOptionSelectionFilter.tsx";
import type {MergedAttribute} from "../../hooks/infra/useMagentoLayeredData.tsx";
import type {OptionLabelMap} from "../../domain/intent-discovery.types.ts";
import type {IntentApiClient} from "../../integration/intent/intentApiClient.ts";
import type {GraphqlClient} from "../graphql/graphqlClient.ts";

export type AnalyseSearchParams = {
    intentApiClient: IntentApiClient
    graphqlClient: GraphqlClient
    filter: MagentoProductFilter
    attributeScore: AttributeFilters
    attributes: MergedAttribute[]
    optionLabelMap: OptionLabelMap
    intentState: IntentEngineState
}

export async function analyseSearch(params: AnalyseSearchParams) {
    const products = await findProducts(params)

    const ai = await fetchRecommendations({
        ...params,
        products
    })

    return { products, ai }
}