import type { GalleryTile } from "./Types.ts";

interface ProductImageProps {
    image: GalleryTile;
    onZoom: () => void;
}

/**
 * This is the main image in the use case the gallery has only 1 image
 *
 * @param image
 * @constructor
 */
export const ProductImage = ({ image, onZoom }: ProductImageProps) => (
    <button
        type="button"
        className="product-gallery__zoom-trigger"
        onClick={onZoom}
        aria-label={`Zoom image: ${image.alt ?? "Product image"}`}
        data-gallery-zoom-trigger
    >
        <img
            src={image.src}
            alt={image.alt ?? ""}
            className="product-gallery__image"
            data-gallery-main
            data-gallery-thumb
        />
    </button>
);