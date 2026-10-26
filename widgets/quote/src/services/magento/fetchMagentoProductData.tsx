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
    products: {
        items: GraphqlProduct[]
        aggregations?: MagentoProductAggregation[] | null
    }
}

export type MagentoProductAggregation = {
    attribute_code: string;
    label: string;
    options: {
        count: number;
        label: string;
        value: string;
        swatch_data?: { value: string; type: string } | null;
    }[];
};

export type QuoteProductFilter = Record<string, string[]>;

export type QuoteProductFacet = {
    code: string;
    label: string;
    options: MagentoProductAggregation["options"];
};

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
          aggregations {
            attribute_code
            label
            options {
              count
              label
              value
              swatch_data {
                value
                type
              }
            }
          }
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
    searchTerm: string,
    filters: QuoteProductFilter = {}
): Promise<{ products: ProductData[]; facets: QuoteProductFacet[] }> {
    const selectedFilters = Object.fromEntries(
        Object.entries(filters).filter(([, values]) => values.length > 0)
    );
    const data = await graphqlClient<ProductsResponse>(
        QUERY,
        {
            filter: Object.fromEntries(
                Object.entries(selectedFilters).map(([attribute, values]) => [attribute, { in: values }])
            ),
            search: searchTerm,
        }
    );

    const candidates = data.products.items;
    const facets = (data.products.aggregations ?? [])
        .filter(aggregation => aggregation.attribute_code !== "price" && aggregation.options.length > 0)
        .map(aggregation => ({
            code: aggregation.attribute_code,
            label: aggregation.label,
            options: aggregation.options,
        }));
    const filterLabels = Object.fromEntries(
        Object.entries(selectedFilters).map(([attribute, values]) => {
            const options = facets.find(facet => facet.code === attribute)?.options ?? [];
            return [attribute, values.map(value => options.find(option => option.value === value)?.label ?? value)];
        })
    );
    const response = await fetch(`${intentApiUrl.replace(/\/+$/, "")}/v1/intent/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Store: storeCode },
        body: JSON.stringify({
            intentText: searchTerm,
            filters: filterLabels,
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
    const products = (result.suggestions ?? [])
        .flatMap(suggestion => {
            const product = productBySku.get(suggestion.sku);
            if (!product) return [];

            return [{
                ...mapProduct(product),
                matchPercentage: suggestion.match,
                matchReason: suggestion.reason ?? null,
            }];
        });

    return { products, facets };
}
