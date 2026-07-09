import type { BannerSlideProps } from "./Types";
import {ZoomableImage} from "./BannerSlide/ZoomableImage.tsx";

export const BannerSlide = ({ slide, visibleSlides = 1, tileMode, zoomActive }: BannerSlideProps) => {
    const { image, title } = slide;

    const wrapperStyle = tileMode
        ? { flex: `0 0 calc((100% - ${(visibleSlides - 1) * 16}px) / ${visibleSlides})` }
        : undefined;

    const focal = image?.focalPoint;

    const objectPosition = focal
        ? `${focal.x * 100}% ${focal.y * 100}%`
        : undefined;

    return (
        <div
            className={`re-banner-slide ${tileMode ? "re-banner-slide--tile" : ""}`}
            style={wrapperStyle}
        >
            {zoomActive && <ZoomableImage
                src={image.src}
                srcSet={image.srcset}
                sizes={image.sizes}
                alt={title?.text}
                objectPosition={objectPosition}
                className="re-banner-image"
            />}
            {!zoomActive && <img
                src={image.src}
                srcSet={image.srcset}
                sizes={image.sizes}
                alt={title?.text}
                className="re-banner-image"
            />}
        </div>
    );
};