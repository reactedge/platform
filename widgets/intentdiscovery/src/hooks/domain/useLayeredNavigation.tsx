import {getLayeredNavigation} from "../../services/layeredNavigation/layeredNavigation.service.ts";
import {useEffect, useState} from "react";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import type {IntentEngineState} from "../../integration/intent/types.ts";
import type {MergedAttribute} from "../infra/useMagentoLayeredData.tsx";
import {useSystemState} from "../../state/System/useSystemState.ts";
import {getError} from "../../lib/error.ts";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";

export type MagentoLayeredNavigation = {
    attributes: MergedAttribute[] | null
    totalCount: number
    baseTotalCount: number
}

type UseLayeredNavigationResult = {
    attributeLayerData: MagentoLayeredNavigation | null
    attributeLayerLoading: boolean
    attributeLayerError: Error | null
    refetch: () => Promise<void>
}

export const useLayeredNavigation = (
    categoryData: CategoryData,
    intentState: IntentEngineState,
    config: IntentDiscoveryDataConfig
): UseLayeredNavigationResult => {
    const { graphqlClient, bootstrap } = useSystemState()
    const initialData = bootstrap?.layeredData

    const shouldFetch =
        !initialData;

    const [data, setData] = useState<MagentoLayeredNavigation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const execute = async (isCancelled?: () => boolean) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getLayeredNavigation(
                categoryData,
                graphqlClient,
                config,
                intentState
            )

            if (isCancelled?.()) return

            setData(data);
        } catch (err: unknown) {
            if (isCancelled?.()) return

            setData(null);
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false

        if (!shouldFetch) return ;

        ;(async () => {
            await execute(() => cancelled)
        })()

        return () => {
            cancelled = true
        }
    }, [categoryData, intentState, graphqlClient])

    const refetch = () => execute()

    return {
        attributeLayerData: initialData ?? data,
        attributeLayerLoading: loading,
        attributeLayerError: error,
        refetch
    }
}