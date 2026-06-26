import { useState } from "react";
import {cardStyle, galleryStyle, hiddenStyle, imgStyle, visibleStyle, arrowBase, fadeStyle, minifyButton, zoomContainer} from "./ProductTiledGallery/style.ts";
import type {GalleryProps} from "./Types.ts";

export const ProductTiledGallery = ({tiles}: GalleryProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [zoomed, setZoomed] = useState(false);

    if (tiles.length === 0) return null;

    const prev = () =>
        setActiveIndex((i) => (i === 0 ? tiles.length - 1 : i - 1));
    const next = () =>
        setActiveIndex((i) => (i === tiles.length - 1 ? 0 : i + 1));

    /* ZOOM MODE VIEW */
    if (zoomed) {
        return (
            <div style={zoomContainer} data-gallery-zoom>
                {/* Minify button */}
                <div style={minifyButton} onClick={() => setZoomed(false)}  data-gallery-minify>
                    Minify ✕
                </div>

                {/* Navigation arrows */}
                <div style={{ ...arrowBase, left: "20px" }} onClick={prev}  data-gallery-prev>
                    ‹
                </div>
                <div style={{ ...arrowBase, right: "20px" }} onClick={next}  data-gallery-next>
                    ›
                </div>

                {/* Main fullscreen image */}
                <img
                    key={activeIndex}
                    src={tiles[activeIndex].src}
                    alt={tiles[activeIndex].alt}
                    style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "85vh",
                        objectFit: "contain",
                        borderRadius: "12px",
                        ...fadeStyle,
                    }}
                    data-gallery-main
                />
            </div>
        );
    }

    return (
        <div style={galleryStyle} data-gallery-tiled>
            {tiles.map((tile, index) => {
                const isVisible = true;

                return (
                    <div
                        key={index}
                        style={{
                            ...cardStyle,
                            ...(isVisible ? visibleStyle : hiddenStyle)
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        onClick={() => {
                            setActiveIndex(index);
                            setZoomed(true);
                        }}
                    >
                        <img src={tile.src}
                             alt={tile.alt}
                             style={imgStyle}
                             data-gallery-tile
                        />
                    </div>
                );
            })}
        </div>
    );
}

