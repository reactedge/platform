import type { WidgetConfig } from "../bootstrap/config/Config.ts";
import { UspList } from "./UspList.tsx";
import { UspNavigation } from "./UspNavigation.tsx";
import { useUspSlider } from "./useUspSlider.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";

type Props = {
    config: WidgetConfig;
};

/**
 * Presents the configured unique selling propositions one at a time,
 * in a carousel at every viewport width.
 *
 * The contract timer rotates the slides automatically until the
 * shopper uses an arrow; from then on navigation is manual only.
 * Rotation pauses while keyboard focus is inside the widget.
 */
export const UspWidget = ({ config }: Props) => {
    const { t } = useTranslationState();
    const { slides } = config.data;
    const { theme, timer } = config.settings;
    const { slider, navigation, focus } = useUspSlider({
        total: slides.length,
        timer,
    });

    return (
        <section
            className={`reactedge-usp usp-panel ${theme}`}
            aria-label={t("Unique selling points")}
            aria-roledescription="carousel"
            data-usp-widget
            data-usp-theme={theme}
            data-usp-autoplay={slider.autoplay ? "on" : "off"}
            data-usp-paused={slider.autoplay && !slider.rotating}
            onFocus={focus.onFocus}
            onBlur={focus.onBlur}
        >
            <UspList slides={slides} slider={slider} />
            {slides.length > 1 && (
                <UspNavigation navigation={navigation} />
            )}
        </section>
    );
};
