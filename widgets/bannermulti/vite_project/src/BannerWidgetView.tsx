import React from 'react';
import {type RawWidgetConfig, readWidgetConfig} from "./Config.ts";
import {BannerStatic} from "./components/BannerStatic.tsx";
import {Spinner} from "./components/Spinner.tsx";

type Props = {
    rawConfig: RawWidgetConfig;
};

export const BannerWidgetView = ({ rawConfig }: Props) => {
    const config = readWidgetConfig(rawConfig);

    if (!config) return null;

    if (config.slides.length === 0) return <Spinner />;

    return <BannerStatic slides={config.slides} config={config.settings} />;
};

