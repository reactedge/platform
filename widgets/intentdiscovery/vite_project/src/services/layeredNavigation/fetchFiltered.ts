import {
    LAYERED_ATTRIBUTE_DATA
} from "../../hooks/infra/useMagentoLayeredData.tsx";
import {getAttributesFilter} from "./buildFilter.ts";
import type {IntentEngineState} from "../../integration/intent/types.ts";
import type {MagentoProducts, ProductAttributesResponse} from "../../hooks/infra/useProductFilteredAttributeLayer.tsx";
import type {GraphqlClient} from "../graphql/graphqlClient.ts";

const filteredCache = new Map()

export async function fetchFiltered(
    categoryIds: number[],
    graphqlClient: GraphqlClient,
    intentState?: IntentEngineState
): Promise<MagentoProducts> {
    const key = JSON.stringify({
        categoryIds,
        filters: getAttributesFilter(categoryIds, intentState)
    })

    if (filteredCache.has(key)) {
        return filteredCache.get(key)
    }

    const filter = getAttributesFilter(categoryIds, intentState);
    const result = await graphqlClient<ProductAttributesResponse>(
        LAYERED_ATTRIBUTE_DATA,
        { filter }
    );
    filteredCache.set(key, structuredClone(result?.products))

    return result?.products
}