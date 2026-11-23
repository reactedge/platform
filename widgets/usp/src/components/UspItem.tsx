import type { UspItemProps } from "./Types.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";

/**
 * Renders one selling proposition as a slide with an optional heading
 * and descriptive text. Inactive slides are hidden from assistive
 * technology because they are outside the visible window.
 */
export const UspItem = ({ slide, position, total, isActive }: UspItemProps) => {
    const { t } = useTranslationState();

    return (
        <li
            className="usp-item"
            aria-roledescription="slide"
            aria-label={t("%1 of %2", position, total)}
            aria-hidden={!isActive}
            data-usp-slide
            data-usp-active={isActive}
        >
            {slide.heading !== undefined && (
                <h3
                    className="usp-item__heading"
                    data-usp-heading
                >
                    {slide.heading}
                </h3>
            )}
            <p className="usp-item__text" data-usp-text>
                {slide.text}
            </p>
        </li>
    );
};
