import type { UspvItemProps } from "./Types.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";

/**
 * Renders one selling proposition as a slide with an optional heading
 * and descriptive text. Inactive slides are hidden from assistive
 * technology because they are outside the visible window.
 */
export const UspvItem = ({ slide, position, total, isActive }: UspvItemProps) => {
    const { t } = useTranslationState();

    return (
        <li
            className="uspv-item"
            aria-roledescription="slide"
            aria-label={t("%1 of %2", position, total)}
            aria-hidden={!isActive}
            data-uspv-slide
            data-uspv-active={isActive}
        >
            {slide.heading !== undefined && (
                <h3
                    className="uspv-item__heading"
                    data-uspv-heading
                >
                    {slide.heading}
                </h3>
            )}
            <p className="uspv-item__text" data-uspv-text>
                {slide.text}
            </p>
        </li>
    );
};
