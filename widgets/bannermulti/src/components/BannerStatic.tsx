import React from 'react';
import { BannerSlide } from "./BannerSlide.tsx";
import type { BannerStaticProps } from "./Types.ts";

export const BannerStatic = ({ slides, config }: BannerStaticProps) => {
    const getRatioClass = () => {
        if (typeof window !== "undefined") {
            if (window.matchMedia("(max-width: 640px)").matches) {
                return `ratio-${(config.mode.mobile || "3:4").replace(":", "-")}`;
            }

            if (
                window.matchMedia("(min-width: 641px) and (max-width: 1024px)")
                    .matches
            ) {
                return `ratio-${(config.mode.tablet || "4:3").replace(":", "-")}`;
            }
        }

        return `ratio-${(config.mode.desktop || "16:7").replace(":", "-")}`;
    };

    const getColumnsClass = () => {
        const slideCount = slides.length;

        if (typeof window !== "undefined") {
            if (window.matchMedia("(max-width: 640px)").matches) {
                return "cols-1";
            }

            if (
                window.matchMedia("(min-width: 641px) and (max-width: 1024px)")
                    .matches
            ) {
                return slideCount >= 2 ? "cols-2" : "cols-1";
            }
        }

        if (slideCount >= 3) return "cols-3";
        if (slideCount === 2) return "cols-2";

        return "cols-1";
    };

    return (
        <div className={`banner-static-grid ${getColumnsClass()}`}>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`banner-static-item ${getRatioClass()}`}
                >
                    <BannerSlide
                        slide={slide}
                        isActive={false}
                        tileMode={true}
                    />
                </div>
            ))}
        </div>
    );
};