import { useMagentoProductData } from "../infra/useMagentoProductData.tsx";
import type { BootstrapData } from "../../entrypoints/ssr.tsx";

export function useProductData(
    sku: string,
    bootstrap?: BootstrapData
) {
    const initialData = bootstrap?.productData;

    const shouldFetch = initialData === undefined;

    const {
        magentoProductData,
        loading: productLoading,
        error: productError,
        refetch,
    } = useMagentoProductData(
        shouldFetch,
        sku
    );

    return {
        productData: shouldFetch ? magentoProductData ?? null : initialData,

        productLoading:
            shouldFetch && productLoading,

        productError:
            shouldFetch ? productError : null,

        refetch,
    };
}