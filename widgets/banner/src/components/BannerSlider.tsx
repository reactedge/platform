import { useState } from "react";
import { BannerSlide } from "./BannerSlide.tsx";
import { NavigationDots } from "./NavigationDots.tsx";
import { NavigationArrows } from "./NavigationArrows.tsx";
import type {BannerSliderProps} from "./Types.ts";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";

export const BannerSlider = ({ slides, config }: BannerSliderProps) => {
    const activity = useActivityContext()
    const [currentIndex, setCurrentIndex] = useState(0);

    const mode = config.mode.desktop;
    const w = config.imageWidth;
    const h = config.imageHeight;

    activity.log('banner_slider', 'Banner Slider', {
        mode,
        w,
        h
    });

    return (
        <div className="banner-media">
            <div style={{
                width: w ?? '100%',
                height: h ?? 'auto',
                aspectRatio: h ? undefined : '16 / 9'
            }}>
                {slides.map((slide, i) => (
                    <BannerSlide
                        key={i}
                        slide={slide}
                        isActive={i === currentIndex}
                        tileMode={false}
                    />
                ))}
            </div>

            <NavigationDots
                current={currentIndex}
                total={slides.length}
                onChange={setCurrentIndex}
            />

            <NavigationArrows
                current={currentIndex}
                total={slides.length}
                onChange={setCurrentIndex}
            />
        </div>
    );
};
