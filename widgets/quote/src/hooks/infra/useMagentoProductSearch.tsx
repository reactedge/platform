import { useEffect, useState } from "react";
import { useSystemState } from "../../state/System/useSystemState.ts";
import { getError } from "../../lib/error.ts";
import type { ProductData } from "../../Config.ts";
import { searchMagentoProducts, type QuoteProductFacet, type QuoteProductFilter } from "../../services/magento/fetchMagentoProductData.tsx";

export function useMagentoProductSearch(searchTerm: string, filters: QuoteProductFilter) {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [facets, setFacets] = useState<QuoteProductFacet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
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
                        setProducts(result.products);
                        setFacets(result.facets);
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
    }, [filters, graphqlClient, intentApiUrl, searchTerm, storeCode]);

    return { products, facets, loading, error };
}
