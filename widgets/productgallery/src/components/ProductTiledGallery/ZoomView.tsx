import type {GalleryTile} from "../Types.ts";
import {arrowBase, fadeStyle, minifyButton, zoomContainer} from "./style.ts";

interface ZoomViewProps {
    image: GalleryTile;
    activeIndex: number;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void
}

export const ZoomView = ({ image, activeIndex, onClose, onPrevious, onNext }: ZoomViewProps) => {
    return (
        <div style={zoomContainer} data-gallery-zoom>
            {/* Minify button */}
            <div style={minifyButton} onClick={() => onClose()} data-gallery-minify>
                Minify ✕
            </div>

            {/* Navigation arrows */}
            <div style={{...arrowBase, left: "20px"}} onClick={onPrevious} data-gallery-prev>
                ‹
            </div>
            <div style={{...arrowBase, right: "20px"}} onClick={onNext} data-gallery-next>
                ›
            </div>

            {/* Main fullscreen image */}
            <img
                key={activeIndex}
                src={image.src}
                alt={image.alt}
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