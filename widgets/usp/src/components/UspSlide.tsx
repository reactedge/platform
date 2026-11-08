import type { UspSlideProps } from "./Types";
import { SlideSeparator } from "./SlideSeparator.tsx";

export const UspSlide = ({ slide, isActive, showSeparator = false }: UspSlideProps) => {
    const { text, heading } = slide;

    return (
        <li data-usp-slide
             data-usp-active={isActive || undefined}
        >
            {heading && <h3 className="usp-slide__heading">{heading}</h3>}
            <p className="usp-slide__text">
                {text}
            </p>
            {showSeparator && <SlideSeparator />}
        </li>
    );

};