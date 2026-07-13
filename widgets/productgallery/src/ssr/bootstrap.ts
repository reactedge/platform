import { createGraphqlService } from "../services/graphql/graphql.service.ts";
import type { ReactEdgeRuntimeConfig } from "../components/Types.ts";
import { fetchMagentoGalleryData } from "../services/magento/fetchMagentoGalleryData.tsx";
import { WIDGET_ID } from "../Config.ts";
import fs from 'node:fs/promises';

export async function loadRuntime(): Promise<ReactEdgeRuntimeConfig> {
    const path =
        `./widgets/${WIDGET_ID}/public/reactedge-runtime.json`;

    return JSON.parse(
        await fs.readFile(path, 'utf8')
    );
}

export async function buildBootstrap(runtimeConfig: ReactEdgeRuntimeConfig) {
    const graphqlApi = getGraphqQlAPI(runtimeConfig);

    const graphqlClient = createGraphqlService(
        graphqlApi as string,
        runtimeConfig.storeCode
    );

    const galleryData =
        await fetchMagentoGalleryData(
            graphqlClient,
            runtimeConfig.sku
        );

    return {
        galleryData
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