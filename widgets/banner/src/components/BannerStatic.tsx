import React from 'react';
import { BannerSlide } from "./BannerSlide.tsx";
import type {BannerStaticProps} from "./Types.ts";

export const BannerStatic = ({ slides }: BannerStaticProps) => {
    return (
        <div className="reactedge-banner-static">
            {slides.map((slide, index) => {
                return (
                    <div
                        key={index}
                        className="reactedge-banner-static__item"
                    >
                        <BannerSlide
                            slide={slide}
                            isActive={false}
                            tileMode={true}
                        />
                    </div>
                );
            })}
        </div>
    );
};
