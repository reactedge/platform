import React from 'react';
import {UspWidget} from "./components/UspWidget.tsx";
import {Spinner} from "./components/Spinner.tsx";
import {readWidgetConfig, type RuntimeConfig, type WidgetConfig} from "./Config.ts";
import {UspMobileWidget} from "./components/UspMobileWidget.tsx";

type Props = {
    rawConfig: WidgetConfig;
    runtimeConfig: RuntimeConfig
};

export const UspWidgetView = ({ rawConfig, runtimeConfig }: Props) => {
    const config = readWidgetConfig(rawConfig);

    if (!config) return null;

    if (config.data.slides.length === 0) return <Spinner />;

    if (runtimeConfig.userAgent === 'mobile') {
        return <UspMobileWidget config={config} slides={config.data.slides} />
    }

    return <UspWidget config={config}  />
};

