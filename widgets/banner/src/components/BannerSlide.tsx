import React from 'react';
import type { BannerSlideProps } from "./Types";
import {
    slideWrapper,
    slideActive
} from "./BannerSlide/style";

export const BannerSlide = ({ slide, isActive, tileMode }: BannerSlideProps) => {
    const { image } = slide;

    const focal = { x: 0.5, y: 0.5 };

    const wrapperStyle: React.CSSProperties = tileMode
        ? {}
        : {
            ...slideWrapper,
            ...(isActive ? slideActive : {})
        };

    return (
        <div style={wrapperStyle}
             data-banner-slide
             data-banner-active={isActive || undefined}
        >
            <img
                src={image.src}
                srcSet={image.srcset}
                sizes={image.sizes}
                alt={image?.alt || ""}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: `${focal.x * 100}% ${focal.y * 100}%`
                }}
            />
        </div>
    );
};