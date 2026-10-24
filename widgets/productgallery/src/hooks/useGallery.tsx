import { useState, useEffect } from "react";
import type { GalleryTile } from "../components/Types.ts";

export function useGallery(images: GalleryTile[]) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (images.length === 0) return;

        setActiveIndex(images.length - 1);
    }, [images]);

    const previous = () => {
        setActiveIndex((index) =>
            index === 0 ? images.length - 1 : index - 1
        );
    };

    const next = () => {
        setActiveIndex((index) =>
            index === images.length - 1 ? 0 : index + 1
        );
    };

    const select = (index: number) => {
        setActiveIndex(index);
    };

    return {
        activeIndex,
        setActiveIndex,
        previous,
        next,
        select,
        currentImage: images[activeIndex],
    };
}