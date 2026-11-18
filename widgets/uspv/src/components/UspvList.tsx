import type { UspvListProps } from "./Types.ts";
import { UspvItem } from "./UspvItem.tsx";

/**
 * Renders the selling propositions as a horizontal track, like the USP
 * mobile slider; only the active slide is inside the panel's window.
 *
 * Announcements stay off while the timer rotates slides and become
 * polite when rotation is paused (focus inside) or stopped (manual use).
 */
export const UspvList = ({ slides, slider }: UspvListProps) => {
    return (
        <ul
            className="uspv-list"
            aria-live={slider.rotating ? "off" : "polite"}
            style={{ transform: `translateX(-${slider.activeIndex * 100}%)` }}
            data-uspv-list
        >
            {slides.map((slide, index) => (
                <UspvItem
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
