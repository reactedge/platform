import type { FocusEvent } from "react";

export interface UspSlideData {
    heading?: string | undefined;
    text: string;
}

/** Contract translations: English source string -> translated string. */
export type TranslationsConfig = Record<string, string> | undefined;

export type UspTheme = "light" | "dark" | "promo";

export interface UspSettings {
    /** Auto-rotation interval in milliseconds. */
    timer: number;
    theme: UspTheme;
}

/**
 * Slider state shared by the list and the panel.
 *
 * `autoplay` is true while the contract timer drives navigation and
 * becomes false for good once the shopper uses an arrow.
 * `rotating` is true when the timer is actually running: autoplay is on
 * and keyboard focus is not inside the widget.
 */
export interface UspSliderState {
    activeIndex: number;
    autoplay: boolean;
    rotating: boolean;
}

/** Focus handlers that pause rotation while focus is inside the widget. */
export interface UspFocusHandlers {
    onFocus: () => void;
    onBlur: (event: FocusEvent<HTMLElement>) => void;
}

/** Manual navigation actions; each one stops the timer. */
export interface UspNavigationActions {
    previous: () => void;
    next: () => void;
}

export interface UspListProps {
    slides: UspSlideData[];
    slider: UspSliderState;
}

export interface UspItemProps {
    slide: UspSlideData;
    position: number;
    total: number;
    isActive: boolean;
}

export interface UspNavigationProps {
    navigation: UspNavigationActions;
}
