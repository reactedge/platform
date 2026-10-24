import type { GalleryTile } from "./Types.ts";
import { useState } from "react";
import { ImageZoomDialog } from "reactedge-image-zoom";
import { useGallery } from "../hooks/useGallery.tsx";
import { TileGrid } from "./ProductTiledGallery/TileGrid.tsx";
import { useGalleryAvailability } from "../hooks/domain/useGalleryAvailability.tsx";

interface ProductTiledGalleryProps {
    tiles: GalleryTile[];
    maxColumns: number;
}

export const ProductTiledGallery = ({ tiles, maxColumns }: ProductTiledGalleryProps) => {
    const gallery = useGallery(tiles);
    const [zoomOpen, setZoomOpen] = useState(false);

    const currentImage = useGalleryAvailability(
        tiles,
        gallery.currentImage
    );

    if (!currentImage) {
        return null;
    }

    return (
        <>
            {!zoomOpen && (
                <TileGrid
                    tiles={tiles}
                    maxColumns={maxColumns}
                    onSelect={index => {
                        gallery.select(index);
                        setZoomOpen(true);
                    }}
                />
            )}
            <ImageZoomDialog
                image={currentImage}
                title={currentImage.alt || "Product image"}
                open={zoomOpen}
                onClose={() => setZoomOpen(false)}
                onPrevious={gallery.previous}
                onNext={gallery.next}
            />
        </>
    );
}

