import React from 'react';
import type { UspSlideProps } from "./Types";

export const UspSlide = ({ slide, isActive }: UspSlideProps) => {
    const { text } = slide;

    return (
        <div data-usp-slide
            data-usp-active={isActive || undefined}
        >{text}</div>
    );

};