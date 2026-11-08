import { UspSlide } from "./UspSlide.tsx";
import type { UspStaticProps } from "./Types.ts";

export function UspStatic({ slides, config }: UspStaticProps) {
    return (
        <ul className={`usp-static-bar ${config.theme || 'light'}`}>
            {slides.map((slide, index) => (
                <UspSlide
                    key={index}
                    slide={slide}
                    isActive={false}
                    showSeparator={index < slides.length - 1}
                />
            ))}
        </ul>
    );
}
