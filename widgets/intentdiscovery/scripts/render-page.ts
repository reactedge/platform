import fs from 'fs/promises';
import {renderHtml} from "../vite_project/src/ssr/entry.tsx";
import 'dotenv/config';
import {ReactEdgeRuntimeConfig} from "../vite_project/src/domain/intent-discovery.types";
import {fetchMagentoCategory} from "../vite_project/src/services/magento/fetchMagentoCategory";
import {createGraphqlService} from "../vite_project/src/services/graphql/graphql.service";
import {getLayeredNavigation} from "../vite_project/src/services/layeredNavigation/layeredNavigation.service";

const run = async () => {
    const contractPath = process.argv[2];

    if (!contractPath) {
        throw new Error('Missing contract path');
    }

    const config = JSON.parse(
        await fs.readFile(contractPath, 'utf8')
    );

    const runtimeConfig: ReactEdgeRuntimeConfig = {
        integrations: {
            magentoGraphql: {
                api: process.env.MAGENTO_GRAPHQL_API!
            },
            intentApi: {
                baseUrl: process.env.INTENT_API!
            }
        },
        storeCode:  'default',
        category: 'tops-men'
    };

    const graphqlClient = createGraphqlService(
        runtimeConfig.integrations.magentoGraphql.api,
        runtimeConfig.storeCode
    );

    const categoryData= await fetchMagentoCategory(graphqlClient, runtimeConfig.category);
    const layeredData = await getLayeredNavigation(
        categoryData,
        graphqlClient,
        config
    );

    const bootstrap = {
        categoryData,
        layeredData
    }

    const finalHtml = renderHtml(config, runtimeConfig, bootstrap)

    process.stdout.write(finalHtml);
};

run();