import type { ProductData } from "../../Config.ts";
import type { GraphqlClient } from "@reactedge/framework/graphql/graphqlClient.ts";

export type GraphqlProduct = {
    id?: string | null;
    sku?: string | null;
    name?: string | null;
    short_description?: { html?: string | null } | null;
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
    products: { items: GraphqlProduct[] }
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
    query GetProducts($filter: ProductAttributeFilterInput!, $search: String) {
                        products(filter: $filter, search: $search, pageSize: 40) {
        items {
          id
                    sku
          name
                    short_description {
                        html
                    }
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
            search: null,
        }
    );

    const product = firstProduct(data);

    if (!product) {
        return null;
    }

    return mapProduct(product);
}

export async function searchMagentoProducts(
    graphqlClient: GraphqlClient,
    intentApiUrl: string,
    storeCode: string,
    searchTerm: string
): Promise<ProductData[]> {
    const data = await graphqlClient<ProductsResponse>(
        QUERY,
        { filter: {}, search: searchTerm }
    );

    const candidates = data.products.items;
    const response = await fetch(`${intentApiUrl.replace(/\/+$/, "")}/v1/intent/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Store: storeCode },
        body: JSON.stringify({
            intentText: searchTerm,
            filters: {},
            products: candidates.map(product => ({
                sku: product.sku ?? "",
                title: product.name ?? "",
                shortDescription: product.short_description?.html ?? null,
                attributes: {},
            })),
        }),
    });
    if (!response.ok) {
        throw new Error("Intent recommendation request failed");
    }

    const result = await response.json() as {
        suggestions?: { sku: string; match: number; reason?: string | null }[] | null;
    };
    const productBySku = new Map(candidates.map(product => [product.sku ?? "", product]));
    return (result.suggestions ?? [])
        .flatMap(suggestion => {
            const product = productBySku.get(suggestion.sku);
            if (!product) return [];

            return [{
                ...mapProduct(product),
                matchPercentage: suggestion.match,
                matchReason: suggestion.reason ?? null,
            }];
        });
}
