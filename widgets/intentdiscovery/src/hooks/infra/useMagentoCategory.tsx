import { useEffect, useState } from "react";
import {useSystemState} from "../../state/System/useSystemState.ts";
import {getError} from "../../lib/error.ts";
import {fetchMagentoCategory} from "../../services/magento/fetchMagentoCategory.ts";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";


export function useMagentoCategory(enabled: boolean, urlKey?: string) {
    const [data, setData] = useState<CategoryData>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const load = async (urlKey?: string) => {
        if (!urlKey) return;

        setLoading(true);
        setError(null);

        try {
            const result = await fetchMagentoCategory(graphqlClient, urlKey)
            setData(result);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!enabled) {
            return;
        }

        load(urlKey);
    }, [urlKey, enabled]);

    return { magentoCategory: data, loading, error, refetch: load };
}
