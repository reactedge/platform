import type { ProductData } from "../../Config.ts";
import type { GraphqlClient } from "@reactedge/framework/graphql/graphqlClient.ts";

export type GraphqlProduct = {
    __typename?: string | null;
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
    configurable_options?: {
        attribute_code: string;
        label: string;
        values: { uid: string; label: string }[];
    }[] | null;
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
    }[];
};

export type QuoteProductFilter = Record<string, string[]>;

export type QuoteProductFacet = {
    code: string;
    label: string;
    options: MagentoProductAggregation["options"];
};

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
        productType: product.__typename ?? "SimpleProduct",
        configurableOptions: (product.configurable_options ?? []).map(option => ({
            attributeCode: option.attribute_code,
            label: option.label,
            values: option.values.map(value => ({ uid: value.uid, label: value.label })),
        })),
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
            }
          }
        items {
          __typename
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
                    ... on ConfigurableProduct {
                      configurable_options {
                        attribute_code
                        label
                        values {
                          uid
                          label
                        }
                      }
                    }
        }
      }
    }
`;

export async function searchMagentoProducts(
    graphqlClient: GraphqlClient,
    intentApiUrl: string,
    storeCode: string,
    searchTerm: string,
    filters: QuoteProductFilter = {}
): Promise<{ products: ProductData[]; facets: QuoteProductFacet[]; resolvedFilters: QuoteProductFilter }> {
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
    const response = await fetch(`${intentApiUrl.replace(/\/+$/, "")}/v1/intent/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Store: storeCode },
        body: JSON.stringify({
            intentText: searchTerm,
            filters: selectedFilters,
            attributes: facets.map(facet => ({
                code: facet.code,
                label: facet.label,
                options: facet.options.map(option => ({ label: option.label, value: option.value })),
            })),
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
        filters?: QuoteProductFilter;
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

    return { products, facets, resolvedFilters: result.filters ?? selectedFilters };
}
