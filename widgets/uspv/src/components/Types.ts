import type { FocusEvent } from "react";

export interface UspvSlideData {
    heading?: string | undefined;
    text: string;
}

/** Contract translations: English source string -> translated string. */
export type TranslationsConfig = Record<string, string> | undefined;

export type UspvTheme = "light" | "dark" | "promo";

export interface UspvSettings {
    /** Auto-rotation interval in milliseconds. */
    timer: number;
    theme: UspvTheme;
}

/**
 * Slider state shared by the list and the panel.
 *
 * `autoplay` is true while the contract timer drives navigation and
 * becomes false for good once the shopper uses an arrow.
 * `rotating` is true when the timer is actually running: autoplay is on
 * and keyboard focus is not inside the widget.
 */
export interface UspvSliderState {
    activeIndex: number;
    autoplay: boolean;
    rotating: boolean;
}

/** Focus handlers that pause rotation while focus is inside the widget. */
export interface UspvFocusHandlers {
    onFocus: () => void;
    onBlur: (event: FocusEvent<HTMLElement>) => void;
}

/** Manual navigation actions; each one stops the timer. */
export interface UspvNavigationActions {
    previous: () => void;
    next: () => void;
}

export interface UspvListProps {
    slides: UspvSlideData[];
    slider: UspvSliderState;
}

export interface UspvItemProps {
    slide: UspvSlideData;
    position: number;
    total: number;
    isActive: boolean;
}

export interface UspvNavigationProps {
    navigation: UspvNavigationActions;
}
