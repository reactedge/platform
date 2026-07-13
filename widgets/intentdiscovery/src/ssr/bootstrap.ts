import {fetchMagentoCategory} from "../services/magento/fetchMagentoCategory.ts";
import {getLayeredNavigation} from "../services/layeredNavigation/layeredNavigation.service.ts";
import {createGraphqlService} from "../services/graphql/graphql.service.ts";
import type {IntentDiscoveryDataConfig, ReactEdgeRuntimeConfig} from "../domain/intent-discovery.types.ts";

export async function buildBootstrap(
    config: IntentDiscoveryDataConfig,
    runtimeConfig: ReactEdgeRuntimeConfig
) {
    const graphqlApi = getGraphqQlAPI(runtimeConfig);

    const graphqlClient = createGraphqlService(
        graphqlApi as string,
        runtimeConfig.storeCode
    );

    const categoryData =
        await fetchMagentoCategory(
            graphqlClient,
            runtimeConfig.category
        );

    const layeredData =
        await getLayeredNavigation(
            categoryData,
            graphqlClient,
            config
        );

    return {
        categoryData,
        layeredData
    };
}

function getGraphqQlAPI(runtimeConfig: ReactEdgeRuntimeConfig) {
    const magentoGraphql =
        runtimeConfig.integrations.magentoGraphql;

    const graphqlApi = magentoGraphql.api

    if (!graphqlApi) {
        throw new Error(
            'No Magento GraphQL endpoint configured'
        );
    }

    return graphqlApi
}