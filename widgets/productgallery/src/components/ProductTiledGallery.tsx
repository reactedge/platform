import type {GalleryTile} from "./Types.ts";
import {ZoomView} from "./ProductTiledGallery/ZoomView.tsx";
import {useGallery} from "../hooks/useGallery.tsx";
import {TileGrid} from "./ProductTiledGallery/TileGrid.tsx";

interface ProductTiledGalleryProps {
    tiles: GalleryTile[]
}

export const ProductTiledGallery = ({tiles}: ProductTiledGalleryProps) => {
    const gallery = useGallery(tiles);

    if (tiles.length === 0) return null;

    if (gallery.currentImage === undefined) return null

    if (gallery.zoomed) {
        return (
            <ZoomView
                image={gallery.currentImage}
                activeIndex={gallery.activeIndex}
                onClose={() => gallery.setZoomed(false)}
                onPrevious={gallery.previous}
                onNext={gallery.next}
            />
        );
    }

    return (
        <TileGrid
            tiles={tiles}
            onSelect={(index) => {
                gallery.setActiveIndex(index);
                gallery.setZoomed(true);
            }}
        />
    );
}

