import { type FocusEvent, useCallback, useEffect, useState } from "react";
import type { UspvFocusHandlers, UspvNavigationActions, UspvSliderState } from "./Types.ts";

interface UspvSliderOptions {
    /** Number of slides in the contract. */
    total: number;
    /** Contract auto-rotation interval in milliseconds. */
    timer: number;
}

interface UspvSliderController {
    slider: UspvSliderState;
    navigation: UspvNavigationActions;
    focus: UspvFocusHandlers;
}

const wrap = (index: number, total: number): number =>
    (index + total) % total;

/**
 * Owns the USPV slider state.
 *
 * - Only one slide is active at a time.
 * - While `autoplay` is on, the contract timer advances to the next
 *   slide on every interval.
 * - While keyboard focus is inside the widget, rotation pauses and
 *   resumes when focus leaves (WAI-ARIA carousel pattern).
 * - Any manual navigation switches autoplay off permanently: the
 *   shopper is assumed to prefer navigating without a timer.
 *
 * The timer only runs in the browser (effects do not run during SSR),
 * so server output always shows the first slide.
 */
export function useUspvSlider({
    total,
    timer,
}: UspvSliderOptions): UspvSliderController {
    const [activeIndex, setActiveIndex] = useState(0);
    const [autoplay, setAutoplay] = useState(total > 1);
    const [focused, setFocused] = useState(false);
    const rotating = autoplay && !focused;

    useEffect(() => {
        if (!rotating || total < 2) {
            return;
        }

        const id = window.setInterval(() => {
            setActiveIndex(index => wrap(index + 1, total));
        }, timer);

        return () => window.clearInterval(id);
    }, [rotating, timer, total]);

    const previous = useCallback(() => {
        setAutoplay(false);
        setActiveIndex(index => wrap(index - 1, total));
    }, [total]);

    const next = useCallback(() => {
        setAutoplay(false);
        setActiveIndex(index => wrap(index + 1, total));
    }, [total]);

    const onFocus = useCallback(() => setFocused(true), []);

    const onBlur = useCallback((event: FocusEvent<HTMLElement>) => {
        // Moving between the two arrows keeps focus inside: stay paused.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setFocused(false);
        }
    }, []);

    return {
        slider: { activeIndex, autoplay, rotating },
        navigation: { previous, next },
        focus: { onFocus, onBlur },
    };
}
