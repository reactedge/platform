import React from 'react';
import { useState } from "react";
import { NavigationArrows } from "./NavigationArrows.tsx";
import type { UspSliderProps } from "./Types.ts";
import { UspSlide } from "./UspSlide.tsx";

export function UspSlider({ slides, config }: UspSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className={`usp-slider-bar ${config.theme || 'light'}`}>
            <div className="usp-slider__inner"
                 style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide, i) => (
                    <UspSlide
                        key={i}
                        slide={slide}
                        isActive={i === currentIndex}
                        tileMode={false}
                    />
                ))}
            </div>

            <NavigationArrows
                current={currentIndex}
                total={slides.length}
                onChange={setCurrentIndex}
            />
        </div>
    );
}
