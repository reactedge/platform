import React from 'react';
import type {WidgetConfig} from "../Config.ts";
import type {UspSlideData} from "./Types.ts";
import {UspSlide} from "./UspSlide.tsx";

type Props = {
    config: WidgetConfig;
    onStable?: () => void,
    slides: UspSlideData[]
};

export const UspMobileWidget = ({ config, slides }: Props) => {
    const slide = slides[0]

    return (
        <div className={`usp-static-bar ${config.settings.theme || 'light'}`}>
            <UspSlide slide={slide} isActive={false} tileMode={true} />
        </div>
    );
};
