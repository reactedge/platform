import type {WidgetConfig} from "../bootstrap/config/Config.ts";
import type {UspSlideData} from "./Types.ts";
import {UspSlide} from "./UspSlide.tsx";

type Props = {
    config: WidgetConfig;
    slides: UspSlideData[]
};

export const UspMobileWidget = ({ config, slides }: Props) => {
    const slide = slides[0]

    if (slide === undefined) {
        return null;
    }

    return (
        <ul className={`usp-static-bar ${config.settings.theme || 'light'}`}>
            <UspSlide slide={slide} isActive={false} />
        </ul>
    );
};
