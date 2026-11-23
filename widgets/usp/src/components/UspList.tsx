import type { UspListProps } from "./Types.ts";
import { UspItem } from "./UspItem.tsx";

/**
 * Renders the selling propositions as a horizontal track, like the USP
 * mobile slider; only the active slide is inside the panel's window.
 *
 * Announcements stay off while the timer rotates slides and become
 * polite when rotation is paused (focus inside) or stopped (manual use).
 */
export const UspList = ({ slides, slider }: UspListProps) => {
    return (
        <ul
            className="usp-list"
            aria-live={slider.rotating ? "off" : "polite"}
            style={{ transform: `translateX(-${slider.activeIndex * 100}%)` }}
            data-usp-list
        >
            {slides.map((slide, index) => (
                <UspItem
                    key={`${index}-${slide.text}`}
                    slide={slide}
                    position={index + 1}
                    total={slides.length}
                    isActive={index === slider.activeIndex}
                />
            ))}
        </ul>
    );
};
