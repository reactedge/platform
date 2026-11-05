import { useCallback, useEffect, useState } from "react";
import { useSystemState } from "../../state/System/useSystemState.ts";
import { getError } from "../../lib/error.ts";
import type { ProductData } from "../../Config.ts"
import { fetchMagentoProductData } from "../../services/magento/fetchMagentoProductData.tsx";
export function useMagentoProductData(enabled: boolean, sku?: string) {
    const [data, setData] = useState<ProductData | null>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { graphqlClient } = useSystemState();

    const load = useCallback(async () => {
        if (!enabled || sku === undefined) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await fetchMagentoProductData(graphqlClient, sku);
            setData(result);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    }, [enabled, sku, graphqlClient]);

    useEffect(() => {
        void load();
    }, [load]);

    return {
        magentoProductData: data,
        loading,
        error,
        refetch: load
    };
}