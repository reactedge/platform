import type { UspNavigationProps } from "./Types.ts";
import { handleArrowKeyDown } from "../lib/keyboard.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";

/**
 * Two arrow buttons for manual navigation, one on the left and one on
 * the right of the panel, like the USP mobile rendering. Using either
 * arrow stops the contract timer for the rest of the session.
 */
export const UspNavigation = ({ navigation }: UspNavigationProps) => {
    const { t } = useTranslationState();

    return (
        <>
            <button
                type="button"
                className="usp-arrow usp-arrow--previous"
                aria-label={t("Previous selling point")}
                onClick={navigation.previous}
                onKeyDown={event => handleArrowKeyDown(event, navigation)}
                data-usp-prev
            >
                <span aria-hidden="true">‹</span>
            </button>

            <button
                type="button"
                className="usp-arrow usp-arrow--next"
                aria-label={t("Next selling point")}
                onClick={navigation.next}
                onKeyDown={event => handleArrowKeyDown(event, navigation)}
                data-usp-next
            >
                <span aria-hidden="true">›</span>
            </button>
        </>
    );
};
