import {buildProductQuery, type ProductsResponse} from "../../hooks/infra/useMagentoProducts.tsx";
import type {MagentoProductFilter} from "../../hooks/domain/useOptionSelectionFilter.tsx";
import type {GraphqlProduct} from "../../types/infra/magento/product.types.ts";
import {getDynamicAttributes} from "./buildFilter.ts";
import type {IntentEngineState} from "../../integration/intent/types.ts";
import type {GraphqlClient} from "../graphql/graphqlClient.ts";

export async function findProducts({
   filter,
   intentState,
   graphqlClient
}: {
    filter: MagentoProductFilter
    intentState: IntentEngineState
    graphqlClient: GraphqlClient
}): Promise<GraphqlProduct[]> {
    const dynamicAttributes = getDynamicAttributes(intentState)

    const result = await graphqlClient<ProductsResponse>(
        buildProductQuery(dynamicAttributes),
        { filter }
    )

    if (!result?.products) {
        throw new Error("Failed to fetch products")
    }

    return result.products.items
}