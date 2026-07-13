import {useEffect, useState} from "react";
import {useSystemState} from "../../state/System/useSystemState.ts";
import type {GalleryTile} from "../../components/Types.ts";
import {getError} from "../../lib/error.ts";
import {fetchMagentoGalleryData} from "../../services/magento/fetchMagentoGalleryData.tsx";

export function useMagentoGalleryData(enabled: boolean, sku?: string) {
    const [data, setData] = useState<GalleryTile[]>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const load = async (sku?: string) => {
        if (!sku) return;

        setLoading(true);
        setError(null);

        try {
            const result = await fetchMagentoGalleryData(graphqlClient, sku)
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

        load(sku);
    }, [sku, enabled]);

    return { magentoGalleryData: data, loading, error, refetch: load };
}
