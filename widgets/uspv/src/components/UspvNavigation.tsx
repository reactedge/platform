import type { UspvNavigationProps } from "./Types.ts";
import { handleArrowKeyDown } from "../lib/keyboard.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";

/**
 * Two arrow buttons for manual navigation, one on the left and one on
 * the right of the panel, like the USP mobile rendering. Using either
 * arrow stops the contract timer for the rest of the session.
 */
export const UspvNavigation = ({ navigation }: UspvNavigationProps) => {
    const { t } = useTranslationState();

    return (
        <>
            <button
                type="button"
                className="uspv-arrow uspv-arrow--previous"
                aria-label={t("Previous selling point")}
                onClick={navigation.previous}
                onKeyDown={event => handleArrowKeyDown(event, navigation)}
                data-uspv-prev
            >
                <span aria-hidden="true">‹</span>
            </button>

            <button
                type="button"
                className="uspv-arrow uspv-arrow--next"
                aria-label={t("Next selling point")}
                onClick={navigation.next}
                onKeyDown={event => handleArrowKeyDown(event, navigation)}
                data-uspv-next
            >
                <span aria-hidden="true">›</span>
            </button>
        </>
    );
};
