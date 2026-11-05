import type { ReactEdgeRuntimeConfig } from "../components/Types.ts";
import { fetchMagentoGalleryData } from "../services/magento/fetchMagentoGalleryData.tsx";
import { WIDGET_ID } from "../bootstrap/config/Config.ts";
import fs from 'node:fs/promises';
import {createGraphqlService} from "@reactedge/framework/graphql/graphql.service.ts"

export async function loadRuntime(): Promise<ReactEdgeRuntimeConfig> {
    const path =
        `./widgets/${WIDGET_ID}/public/reactedge-runtime.json`;

    return JSON.parse(
        await fs.readFile(path, 'utf8')
    );
}

export async function buildBootstrap(runtime: ReactEdgeRuntimeConfig) {
    const graphqlApi = getGraphqQlAPI(runtime);

    const graphqlClient = createGraphqlService(
        graphqlApi as string,
        runtime.context.storeCode
    );

    const galleryData =
        await fetchMagentoGalleryData(
            graphqlClient,
            runtime.context.sku
        );

    return {
        galleryData
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