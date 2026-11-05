import type { ProductData } from "../../bootstrap/config/Config.ts";
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
    filters: QuoteProductFilter = {},
    interpretIntent = true
): Promise<{
    products: ProductData[];
    facets: QuoteProductFacet[];
    interpretedFilters: QuoteProductFilter;
}> {
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

    const interpretedFilters = interpretIntent
        ? await interpretQuoteIntent(intentApiUrl, storeCode, searchTerm, facets)
        : {};
    if (interpretIntent && hasUnselectedFilters(selectedFilters, interpretedFilters)) {
        return { products: [], facets, interpretedFilters };
    }
    const recommendationFilters = mergeFilters(selectedFilters, interpretedFilters);
    const response = await fetch(`${intentApiUrl.replace(/\/+$/, "")}/v1/intent/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Store: storeCode },
        body: JSON.stringify({
            intentText: searchTerm,
            filters: toFilterLabels(recommendationFilters, facets),
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

    return { products, facets, interpretedFilters };
}

async function interpretQuoteIntent(
    intentApiUrl: string,
    storeCode: string,
    searchTerm: string,
    facets: QuoteProductFacet[]
): Promise<QuoteProductFilter> {
    const response = await fetch(`${intentApiUrl.replace(/\/+$/, "")}/v1/intent/interpret`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Store: storeCode },
        body: JSON.stringify({
            intent: { text: searchTerm, signals: {} },
            attributes: facets.map(facet => ({
                code: facet.code,
                label: facet.label,
                options: facet.options.map(option => ({
                    label: option.label,
                    value: option.value,
                    count: option.count,
                })),
            })),
        }),
    });
    if (!response.ok) {
        throw new Error("Intent interpretation request failed");
    }

    const result = await response.json() as {
        filters?: { attribute: string; value: string }[] | null;
    };
    return (result.filters ?? []).reduce<QuoteProductFilter>((filters, item) => {
        const values = filters[item.attribute] ?? [];
        if (!values.includes(item.value)) values.push(item.value);
        filters[item.attribute] = values;
        return filters;
    }, {});
}

function mergeFilters(
    selected: QuoteProductFilter,
    interpreted: QuoteProductFilter
): QuoteProductFilter {
    const merged = Object.fromEntries(
        Object.entries(selected).map(([attribute, values]) => [attribute, [...values]])
    );
    for (const [attribute, values] of Object.entries(interpreted)) {
        merged[attribute] = [...new Set([...(merged[attribute] ?? []), ...values])];
    }
    return merged;
}

function hasUnselectedFilters(selected: QuoteProductFilter, interpreted: QuoteProductFilter): boolean {
    return Object.entries(interpreted).some(([attribute, values]) =>
        values.some(value => !selected[attribute]?.includes(value))
    );
}

function toFilterLabels(filters: QuoteProductFilter, facets: QuoteProductFacet[]) {
    return Object.fromEntries(
        Object.entries(filters).map(([attribute, values]) => {
            const options = facets.find(facet => facet.code === attribute)?.options ?? [];
            return [attribute, values.map(value => options.find(option => option.value === value)?.label ?? value)];
        })
    );
}
