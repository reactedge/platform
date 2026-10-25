import type {ProductData} from "../../Config.ts";
import type {GraphqlClient} from "@reactedge/framework/graphql/graphqlClient.ts";

export type GraphqlProduct = {
    id?: string | null;
    sku?: string | null;
    name?: string | null;
    small_image?: { url?: string | null } | null;
    price_range?: {
        minimum_price?: {
            final_price?: {
                value?: number | null;
                currency?: string | null;
            } | null;
        } | null;
    } | null;
};

export type ProductsResponse = {
    products: {items: GraphqlProduct[]}
}

function firstProduct(response: ProductsResponse): GraphqlProduct | undefined {
    return response.products.items[0];
}

function productSku(product: GraphqlProduct): string {
    return product.sku ?? "";
}

function productName(product: GraphqlProduct): string {
    return product.name ?? "";
}

function productImageUrl(product: GraphqlProduct): string {
    return product.small_image?.url ?? "";
}

function productFinalPrice(product: GraphqlProduct) {
    return product.price_range?.minimum_price?.final_price;
}

function mapProduct(product: GraphqlProduct): ProductData {
    const finalPrice = productFinalPrice(product);
    return {
        sku: productSku(product),
        name: productName(product),
        imageUrl: productImageUrl(product),
        unitPrice: finalPrice?.value ?? 0,
        currency: finalPrice?.currency ?? "USD",
    };
}

const QUERY = `
  query GetProducts($filter: ProductAttributeFilterInput!) {
            products(filter: $filter) {
        items {
          id
                    sku
          name
                    small_image {
                        url
                    }
                    price_range {
                        minimum_price {
                            final_price {
                                value
                                currency
                            }
                        }
                    }
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

    const product = firstProduct(data);

    if (!product) {
        return null;
    }

    return mapProduct(product);
}