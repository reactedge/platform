import {readWidgetConfig} from "./config/Config.ts";
import {useActivityContext} from "../activity/Context/useActivityContext.ts";
import {BannerSlider} from "../components/BannerSlider.tsx";
import {BannerStatic} from "../components/BannerStatic.tsx";
import {getVisibleSlides} from "../lib/vslide.ts";

type Props = {
    contract?: unknown
    bootstrap?: unknown
};

export const WidgetWrapper = ({contract}: Props) => {
    const activity = useActivityContext()
    const config = readWidgetConfig(contract, activity);

    if (!config) return null;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const isTablet = window.matchMedia("(min-width: 641px) and (max-width: 1024px)").matches;

    let currentMode = config.settings.mode.desktop;

    if (isMobile) currentMode = config.settings.mode.mobile;
    else if (isTablet) currentMode = config.settings.mode.tablet;

    if (currentMode === "slider") {
        const visibleSlides = getVisibleSlides(
            isMobile,
            isTablet,
            config.settings.visibleSlides?? 1
        )
        activity.log('vibille_slides', 'Visible Slides', {isMobile, isTablet, visibleSlides});
        return <BannerSlider slides={config.slides} visibleSlides={visibleSlides} />;
    }

    return <BannerStatic slides={config.slides} config={config.settings} />;
};
