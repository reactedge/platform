import React from 'react';
import {type RawWidgetConfig, readWidgetConfig, type RuntimeConfig} from "../../Config.ts";
import {BannerStaticSlide} from "../BannerStaticSlide.tsx";
import {BannerWidgetMobileView} from "./BannerWidgetMobileView.tsx";

type Props = {
    rawConfig: RawWidgetConfig;
    runtimeConfig: RuntimeConfig
};

export const BannerWidgetView = ({ rawConfig, runtimeConfig }: Props) => {
    const config = readWidgetConfig(rawConfig);

    if (!config) return null;

    if (config.slides.length === 0) return null;

    return  `runtimeConfig ${runtimeConfig.userAgent}`

    if (runtimeConfig.userAgent === 'mobile') {
        return <BannerWidgetMobileView slides={config.slides} config={config.settings} />
    }

    return (
        <div className="reactedge-banner-view">
            {config.slides.map((slide, index) => {
                return (
                    <div
                        key={index}
                        className="reactedge-banner-view__item"
                    >
                        <BannerStaticSlide
                            slide={slide}
                            isActive={false}
                            tileMode={true}
                            height={rawConfig.data.settings.ssr?.height || rawConfig.data.settings.imageHeight}
                        />
                    </div>
                );
            })}
        </div>
    );
};

