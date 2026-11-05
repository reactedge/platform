import type { ReactEdgeRuntimeConfig } from "../bootstrap/config/Config.ts";
import type { IntentDiscoveryDataConfig } from "../types/domain/intent-discovery.types.ts"
import { WIDGET_ID } from "../bootstrap/config/Config.ts";
import fs from 'node:fs/promises';
import { createGraphqlService } from "@reactedge/framework/graphql/graphql.service.ts"
import { fetchMagentoCategory } from "../services/magento/fetchMagentoCategory.ts";
import { getLayeredNavigation } from "../services/layeredNavigation/layeredNavigation.service.ts";
import { getConfiguredLayeredNavigation } from "../services/layeredNavigation/configuredLayeredNavigation.service.ts"

export async function loadRuntime(): Promise<ReactEdgeRuntimeConfig> {
    const path =
        `./widgets/${WIDGET_ID}/public/reactedge-runtime.json`;

    return JSON.parse(
        await fs.readFile(path, 'utf8')
    );
}

export async function buildBootstrap(
    config: IntentDiscoveryDataConfig,
    runtime: ReactEdgeRuntimeConfig
) {
    const graphqlApi = getGraphqQlAPI(runtime);

    const graphqlClient = createGraphqlService(
        graphqlApi as string,
        runtime.context.storeCode
    );

    const categoryData =
        await fetchMagentoCategory(
            graphqlClient,
            runtime.context.category
        );

    const configuredLayeredData = await getConfiguredLayeredNavigation(
        categoryData,
        graphqlClient
    )

    const layeredData =
        await getLayeredNavigation(
            categoryData,
            graphqlClient,
            config,
            configuredLayeredData
        );

    return {
        categoryData,
        layeredData
    };
}

function getGraphqQlAPI(runtime: ReactEdgeRuntimeConfig) {
    const magentoGraphql =
        runtime.integrations.magentoGraphql;

    const graphqlApi = magentoGraphql.api

    if (!graphqlApi) {
        throw new Error(
            'No Magento GraphQL endpoint configured'
        );
    }

    return graphqlApi
}