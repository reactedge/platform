import type {WidgetConfig} from "../Config.ts";
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
        <div className={`usp-static-bar ${config.settings.theme || 'light'}`}>
            <UspSlide slide={slide} isActive={false} tileMode={true} />
        </div>
    );
};
