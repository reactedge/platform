import type { WidgetConfig } from "../bootstrap/config/Config.ts";
import { UspvList } from "./UspvList.tsx";
import { UspvNavigation } from "./UspvNavigation.tsx";
import { useUspvSlider } from "./useUspvSlider.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";

type Props = {
    config: WidgetConfig;
};

/**
 * Presents the configured unique selling propositions one at a time,
 * using the same visual as the USP widget's mobile slider.
 *
 * The contract timer rotates the slides automatically until the
 * shopper uses an arrow; from then on navigation is manual only.
 * Rotation pauses while keyboard focus is inside the widget.
 */
export const UspvWidget = ({ config }: Props) => {
    const { t } = useTranslationState();
    const { slides } = config.data;
    const { theme, timer } = config.settings;
    const { slider, navigation, focus } = useUspvSlider({
        total: slides.length,
        timer,
    });

    return (
        <section
            className={`uspv-panel ${theme}`}
            aria-label={t("Unique selling points")}
            aria-roledescription="carousel"
            data-uspv-widget
            data-uspv-theme={theme}
            data-uspv-autoplay={slider.autoplay ? "on" : "off"}
            data-uspv-paused={slider.autoplay && !slider.rotating}
            onFocus={focus.onFocus}
            onBlur={focus.onBlur}
        >
            <UspvList slides={slides} slider={slider} />
            {slides.length > 1 && (
                <UspvNavigation navigation={navigation} />
            )}
        </section>
    );
};
