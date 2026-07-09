import { useState } from "react";
import { BannerSlide } from "./BannerSlide.tsx";
import { NavigationDots } from "./NavigationDots.tsx";
import { NavigationArrows } from "./NavigationArrows.tsx";
import type { BannerSliderProps } from "./Types.ts";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";

export const BannerSlider = ({ slides, config, visibleSlides }: BannerSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const activity = useActivityContext()

    const totalGroups = Math.ceil(slides.length / visibleSlides);

    const start = currentIndex * visibleSlides;
    const end = start + visibleSlides;

    const tileMode = visibleSlides > 1;

    activity.log('banner_slider', 'Banner Slider', {
        start,
        end,
        totalGroups,
        tileMode,
        visibleSlides
    });

    return (
        <div className="re-banner-media">
            <div className="re-banner-viewport">
               <div
                    className={`re-banner-track ${
                        tileMode
                            ? "re-banner-track--tiles"
                            : "re-banner-track--single"
                    }`}
                >
                    {slides.slice(start, end).map((slide, i) => (
                        <BannerSlide
                            key={`${start}-${i}`}
                            slide={slide}
                            isActive={false}
                            tileMode={tileMode}
                            visibleSlides={visibleSlides}
                            zoomActive={config.zoomActive}
                        />
                    ))}

                    <NavigationArrows
                        current={currentIndex}
                        total={totalGroups}
                        onChange={setCurrentIndex}
                    />
               </div>
            </div>

            <div className="re-banner-navigation">
                <NavigationDots
                    current={currentIndex}
                    total={totalGroups}
                    onChange={setCurrentIndex}
                />
            </div>
        </div>
    );
};