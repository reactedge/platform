import {activeThumb, arrowBase, containerStyle, mainImageStyle, thumb, thumbnailStrip} from "./ProductGallery/style.ts";
import type {WidgetConfig} from "./Types.ts";
import {useGallery} from "../hooks/useGallery.tsx";

export const ProductGallery = ({tiles}: WidgetConfig) => {
    const gallery = useGallery(tiles);

    if (tiles.length === 0 || gallery.currentImage === undefined) {
        return null;
    }

    return (
        <div style={containerStyle} data-gallery-classic>
            <div
                style={{ ...arrowBase, left: "20px" }}
                onClick={gallery.previous}
                data-gallery-prev
            >
                ‹
            </div>

            <div
                style={{ ...arrowBase, right: "20px" }}
                onClick={gallery.next}
                data-gallery-next
            >
                ›
            </div>

            <img
                key={gallery.activeIndex}
                src={gallery.currentImage.src}
                alt={gallery.currentImage.alt}
                style={mainImageStyle}
                data-gallery-main
            />

            <div style={thumbnailStrip}>
                {tiles.map((tile, index) => (
                    <img
                        key={index}
                        src={tile.src}
                        alt={tile.alt}
                        onClick={() => gallery.select(index)}
                        style={{
                            ...thumb,
                            ...(index === gallery.activeIndex
                                ? activeThumb
                                : {}),
                        }}
                        data-gallery-thumb
                    />
                ))}
            </div>
        </div>
    );
}
