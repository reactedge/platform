import { useMagentoGalleryData } from "../infra/useMagentoGalleryData.tsx";
import type { BootstrapData } from "../../ssr/entry.tsx";

export function useGalleryData(
    sku: string,
    bootstrap?: BootstrapData
) {
    const initialData = bootstrap?.galleryData

    const shouldFetch =
        !initialData;

    const {
        magentoGalleryData,
        loading: galleryLoading,
        error: galleryError,
        refetch,
    } = useMagentoGalleryData(
        shouldFetch,
        sku
    );

    return {
        galleryData:
            initialData ??
            magentoGalleryData,

        galleryLoading:
            shouldFetch
                ? galleryLoading
                : false,

        galleryError:
            shouldFetch
                ? galleryError
                : null,

        refetch,
    };
}