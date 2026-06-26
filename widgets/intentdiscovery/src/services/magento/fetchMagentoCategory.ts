import type {GraphqlClient} from "../../lib/graphql.ts";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";

export type CategoryResponse = {
    categories: {
        items: CategoryData[]
    }
}

const QUERY = `
  query MagentoCategories($filter: CategoryFilterInput!) {
      categories(
        filters: $filter
      ) {
        items {
          id        
          name        
          children {
            id           
          }
        }
      }
    }
`;

export async function fetchMagentoCategory(
    graphqlClient: GraphqlClient,
    urlKey: string
): Promise<CategoryData> {
    const data = await graphqlClient<CategoryResponse>(
        QUERY,
        {
            filter: {
                url_key: {
                    eq: urlKey
                }
            }
        }
    );

    return data?.categories.items?.[0]
}