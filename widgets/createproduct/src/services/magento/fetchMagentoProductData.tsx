import type {ProductData} from "../../Config.ts";
import type {GraphqlClient} from "@reactedge/framework/graphql/graphqlClient.ts";

export type GraphqlProduct = {
    id?: string | null;
    sku?: string | null;
    name?: string | null;
};

export type ProductsResponse = {
    products: {items: GraphqlProduct[]}
}

const QUERY = `
  query GetProducts($filter: ProductAttributeFilterInput!) {
      products(filter: $filter) {           
        items {
          id
          sku  
          name
        }
      }
    }
`;

export async function fetchMagentoProductData(
    graphqlClient: GraphqlClient,
    sku: string
): Promise<ProductData | null> {
    const data = await graphqlClient<ProductsResponse>(
        QUERY,
        {
            filter: {
                sku: {
                    eq: sku,
                },
            },
        }
    );

    const product = data.products.items[0];

    if (!product) {
        return null;
    }

    return {
        sku: product.sku ?? "",
        name: product.name ?? "",
    };
}