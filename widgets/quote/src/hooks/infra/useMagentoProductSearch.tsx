import { useEffect, useState } from "react";
import { useSystemState } from "../../state/System/useSystemState.ts";
import { getError } from "../../lib/error.ts";
import type { ProductData } from "../../Config.ts";
import { searchMagentoProducts } from "../../services/magento/fetchMagentoProductData.tsx";

export function useMagentoProductSearch(searchTerm: string) {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState();

    useEffect(() => {
        const term = searchTerm.trim();
        if (term.length < 2) {
            setProducts([]);
            setLoading(false);
            setError(null);
            return;
        }

        setProducts([]);
        let active = true;
        const timer = window.setTimeout(() => {
            setLoading(true);
            setError(null);
            void searchMagentoProducts(graphqlClient, term)
                .then(results => {
                    if (active) setProducts(results);
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
    }, [graphqlClient, searchTerm]);

    return { products, loading, error };
}