import { useState } from "react";
import type { GalleryTile } from "./Types.ts";
import { ImageZoomDialog } from "reactedge-image-zoom";
import { useGallery } from "../hooks/useGallery.tsx";
import { SpinnerOverlay } from "./global/SpinnerOverlay.tsx";
import { useSelectionState } from "../state/Selection/useSelectionState.tsx";
import { useGalleryAvailability } from "../hooks/domain/useGalleryAvailability.tsx";

interface ProductGalleryProps {
    tiles: GalleryTile[]
}

export const ProductGallery = ({ tiles }: ProductGalleryProps) => {
    const gallery = useGallery(tiles);
    const [zoomOpen, setZoomOpen] = useState(false);
    const { selectionLoading, selectionImage } = useSelectionState()

    const currentImage = useGalleryAvailability(
        tiles,
        gallery.currentImage
    );

    if (!currentImage) {
        return null;
    }

    return (
        <div
            className="product-gallery__slider"
            data-gallery-classic
        >
            <button
                type="button"
                className="product-gallery__slider-arrow product-gallery__slider-arrow--previous"
                onClick={gallery.previous}
                aria-label="Previous image"
                data-gallery-prev
            >
                ‹
            </button>

            <button
                type="button"
                className="product-gallery__slider-arrow product-gallery__slider-arrow--next"
                onClick={gallery.next}
                aria-label="Next image"
                data-gallery-next
            >
                ›
            </button>

            <div className="product-gallery__slider-main">
                <button
                    type="button"
                    className="product-gallery__zoom-trigger"
                    onClick={() => setZoomOpen(true)}
                    aria-label={`Zoom image: ${currentImage.alt ?? "Product image"}`}
                    data-gallery-zoom-trigger
                >
                    <img
                        src={currentImage.src}
                        alt={currentImage.alt}
                        className="product-gallery__slider-main-image"
                        data-gallery-main
                    />
                </button>

                {selectionLoading && (
                    <SpinnerOverlay />
                )}
            </div>

            <div className="product-gallery__slider-thumbnails">
                {tiles.map((tile, index) => (
                    <button
                        key={index}
                        type="button"
                        className={[
                            "product-gallery__slider-thumbnail",
                            index === gallery.activeIndex
                                ? "product-gallery__slider-thumbnail--active"
                                : "",
                        ].filter(Boolean).join(" ")}
                        onClick={() => gallery.select(index)}
                        aria-label={`View image ${index + 1}`}
                        aria-current={
                            index === gallery.activeIndex
                                ? "true"
                                : undefined
                        }
                    >
                        <img
                            src={tile.src}
                            alt={tile.alt}
                            data-gallery-thumb
                        />

                        {selectionLoading &&
                            tile.src === selectionImage?.src && (
                                <SpinnerOverlay />
                            )}
                    </button>
                ))}
            </div>

            <ImageZoomDialog
                image={currentImage}
                title={currentImage.alt || "Product image"}
                open={zoomOpen}
                onClose={() => setZoomOpen(false)}
                onPrevious={gallery.previous}
                onNext={gallery.next}
            />
        </div>
    );
};