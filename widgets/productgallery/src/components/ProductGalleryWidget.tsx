import type { GalleryTile, WidgetConfig } from "./Types.ts";
import { ProductTiledGallery } from "./ProductTiledGallery.tsx";
import { ProductGallery } from "./ProductGallery.tsx";
import { useMagentoSelectionGallery } from "../hooks/domain/useGalleryData.tsx";
import { ProductImage } from "./ProductImage.tsx"
import { useMemo } from "react";
import { useState } from "react";
import { ImageZoomDialog } from "reactedge-image-zoom";
import { useSelectionState } from "../state/Selection/useSelectionState.tsx";

type Props = {
    config: WidgetConfig;
    bootstrap: GalleryTile[];
};

export const ProductGalleryWidget = ({ config, bootstrap }: Props) => {
    const [singleImageZoomOpen, setSingleImageZoomOpen] = useState(false);
    useMagentoSelectionGallery(config.runtime.sku);
    const { selectionImage } = useSelectionState()

    const finalGalleryData = useMemo(
        () => [
            ...bootstrap,
            ...(selectionImage ? [selectionImage] : [])
        ],
        [bootstrap, selectionImage]
    );

    if (finalGalleryData.length === 1) {
        const image = finalGalleryData[0] as GalleryTile;
        return (
            <>
                <ProductImage image={image} onZoom={() => setSingleImageZoomOpen(true)} />
                <ImageZoomDialog
                    image={image}
                    title={image.alt || "Product image"}
                    open={singleImageZoomOpen}
                    onClose={() => setSingleImageZoomOpen(false)}
                />
            </>
        );
    }

    return (
        <div>
            {config.settings.mode === "tile" ? <ProductTiledGallery
                tiles={finalGalleryData}
                maxColumns={config.settings.maxColumns}
            />
                : <ProductGallery tiles={finalGalleryData} />}
        </div>
    );
};

