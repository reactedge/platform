import type { KeyboardEvent } from "react";
import type { UspvNavigationActions } from "../components/Types.ts";

/**
 * Lets a focused arrow button also respond to the horizontal arrow
 * keys, as the USP mobile arrows do. Enter and Space are already
 * handled natively by `button` as clicks.
 */
export function handleArrowKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    navigation: UspvNavigationActions
): void {
    const action = {
        ArrowLeft: navigation.previous,
        ArrowRight: navigation.next,
    }[event.key];

    if (!action) {
        return;
    }

    event.preventDefault();
    action();
}
