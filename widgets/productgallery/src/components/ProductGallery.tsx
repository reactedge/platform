import { useState } from "react";
import {activeThumb, arrowBase, containerStyle, mainImageStyle, thumb, thumbnailStrip} from "./ProductGallery/style.ts";
import type {GalleryProps} from "./Types.ts";


export const ProductGallery = ({tiles}: GalleryProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (tiles.length === 0) return null;

    const prev = () =>
        setActiveIndex((i) => (i === 0 ? tiles.length - 1 : i - 1));

    const next = () =>
        setActiveIndex((i) => (i === tiles.length - 1 ? 0 : i + 1));

    return (
        <div style={containerStyle} data-gallery-classic>
            {/* LEFT ARROW */}
            <div style={{ ...arrowBase, left: "20px" }} onClick={prev} data-gallery-prev>
                ‹
            </div>

            {/* RIGHT ARROW */}
            <div style={{ ...arrowBase, right: "20px" }} onClick={next} data-gallery-next>
                ›
            </div>

            {/* MAIN IMAGE */}
            <img
                key={activeIndex}
                src={tiles[activeIndex].src}
                alt={tiles[activeIndex].alt}
                style={mainImageStyle}
                data-gallery-main
            />

            {/* THUMBNAIL STRIP */}
            <div style={thumbnailStrip}>
                {tiles.map((tile, index) => (
                    <img
                        key={index}
                        src={tile.src}
                        alt={tile.alt}
                        onClick={() => setActiveIndex(index)}
                        style={{
                            ...thumb,
                            ...(index === activeIndex ? activeThumb : {}),
                        }}
                        data-gallery-thumb
                    />
                ))}
            </div>
        </div>
    );
}
