import { useEffect, useRef, useState } from "react";
import { useSystemState } from "../../state/System/useSystemState.ts";
import { getError } from "../../lib/error.ts";
import type { ProductData } from "../../bootstrap/config/Config.ts";
import { searchMagentoProducts, type QuoteProductFacet, type QuoteProductFilter } from "../../services/magento/searchMagentoProducts.ts";

export function useMagentoProductSearch(
    searchTerm: string,
    filters: QuoteProductFilter,
    minSearchLength: number,
    onFiltersInterpreted: (filters: QuoteProductFilter) => void
) {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [facets, setFacets] = useState<QuoteProductFacet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const interpretedTerm = useRef("");
    const { graphqlClient, intentApiUrl, storeCode } = useSystemState();

    useEffect(() => {
        const term = searchTerm.trim();
        if (term.length < minSearchLength) {
            interpretedTerm.current = "";
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
            const shouldInterpret = interpretedTerm.current !== term;
            void searchMagentoProducts(graphqlClient, intentApiUrl, storeCode, term, filters, shouldInterpret)
                .then(result => {
                    if (active) {
                        setFacets(result.facets);
                        if (shouldInterpret) {
                            interpretedTerm.current = term;
                            onFiltersInterpreted(result.interpretedFilters);
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
    }, [filters, graphqlClient, intentApiUrl, minSearchLength, onFiltersInterpreted, searchTerm, storeCode]);

    return { products, facets, loading, error };
}
