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

    const props = {
        src: image.src,
        ...(image.srcset !== undefined
            ? { srcSet: image.srcset }
            : {}),
        ...(image.sizes !== undefined
            ? { sizes: image.sizes }
            : {}),
        ...(title?.text !== undefined
            ? { alt: title?.text }
            : {}),
        ...(objectPosition !== undefined
            ? { objectPosition }
            : {}),
        className: "re-banner-image",
        zoomActive
    };

    return (
        <div
            className={`re-banner-slide ${tileMode ? "re-banner-slide--tile" : ""}`}
            style={wrapperStyle}
        >
            <ZoomableImage {...props} />
        </div>
    );
};