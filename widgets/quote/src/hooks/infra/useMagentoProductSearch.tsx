import { useEffect, useRef, useState } from "react";
import { useSystemState } from "../../state/System/useSystemState.ts";
import { getError } from "../../lib/error.ts";
import type { ProductData } from "../../Config.ts";
import { searchMagentoProducts, type QuoteProductFacet, type QuoteProductFilter } from "../../services/magento/searchMagentoProducts.ts";

function normalizeFilters(filters: QuoteProductFilter): string {
    const entries: [string, string[]][] = Object.entries(filters)
        .map(([attribute, values]) => [attribute, [...values].sort()]);
    entries.sort(([left], [right]) => left.localeCompare(right));
    return JSON.stringify(Object.fromEntries(entries));
}

export function useMagentoProductSearch(
    searchTerm: string,
    filters: QuoteProductFilter,
    onFiltersResolved: (filters: QuoteProductFilter) => void
) {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [facets, setFacets] = useState<QuoteProductFacet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const autoAppliedTerm = useRef("");
    const { graphqlClient, intentApiUrl, storeCode } = useSystemState();

    useEffect(() => {
        const term = searchTerm.trim();
        if (term.length < 2) {
            setProducts([]);
            setFacets([]);
            setLoading(false);
            setError(null);
            return;
        }

        setProducts([]);
        let active = true;
        const timer = window.setTimeout(() => {
            setLoading(true);
            setError(null);
            void searchMagentoProducts(graphqlClient, intentApiUrl, storeCode, term, filters)
                .then(result => {
                    if (active) {
                        setFacets(result.facets);
                        if (autoAppliedTerm.current !== term) {
                            autoAppliedTerm.current = term;
                            if (normalizeFilters(filters) !== normalizeFilters(result.resolvedFilters)) {
                                onFiltersResolved(result.resolvedFilters);
                                return;
                            }
                        }
                        setProducts(result.products);
                    }
                })
                .catch(reason => {
                    if (active) setError(getError(reason));
                })
                .finally(() => {
                    if (active) setLoading(false);
                });
        }, 250);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [filters, graphqlClient, intentApiUrl, onFiltersResolved, searchTerm, storeCode]);

    return { products, facets, loading, error };
}
