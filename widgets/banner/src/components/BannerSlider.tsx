import { useEffect, useState } from "react";
import type { BannerSliderProps } from "./Types.ts";
import { BannerSlide } from "./BannerSlide.tsx";
import { NavigationArrows } from "./NavigationArrows.tsx";
import { NavigationDots } from "./NavigationDots.tsx";
import { useActivityContext } from "../activity/Context/useActivityContext.ts";

export const BannerSlider = ({ slides, visibleSlides }: BannerSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const activity = useActivityContext()

    const totalGroups = Math.ceil(slides.length / visibleSlides);

    const start = currentIndex * visibleSlides;
    const end = start + visibleSlides;

    const tileMode = visibleSlides > 1;

    useEffect(() => {
        activity.log('banner_slider', 'Banner Slider', {
            start,
            end,
            totalGroups,
            tileMode,
            visibleSlides
        });
    }, [activity, end, start, tileMode, totalGroups, visibleSlides]);

    return (
        <div className="re-banner-media">
            <div className="re-banner-viewport">
                <div
                    className={`re-banner-track ${tileMode
                            ? "re-banner-track--tiles"
                            : "re-banner-track--single"
                        }`}
                >
                    {slides.slice(start, end).map((slide, i) => {
                        const absoluteIndex = start + i;

                        return (
                            <BannerSlide
                                key={absoluteIndex}
                                slide={slide}
                                isActive={currentIndex === absoluteIndex}
                                tileMode={tileMode}
                                visibleSlides={visibleSlides}
                            />
                        );
                    })}

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