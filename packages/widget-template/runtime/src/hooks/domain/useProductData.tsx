import { useMagentoProductData } from "../infra/useMagentoProductData.tsx";
import type { BootstrapData } from "../../bootstrap/ssr/render.tsx";

export function useProductData(
    sku: string,
    bootstrap?: BootstrapData
) {
    const initialData = bootstrap?.productData;

    const shouldFetch = !initialData;

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
        productData: magentoProductData,

        productLoading:
            shouldFetch && productLoading,

        productError:
            shouldFetch ? productError : null,

        refetch,
    };
}
