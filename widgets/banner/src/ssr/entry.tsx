import React from 'react';
import { renderToString } from 'react-dom/server';
import type {RawWidgetConfig, RuntimeConfig} from "../Config.ts";
import {BannerWidgetView} from "../components/ssr/BannerWidgetView.tsx";

export const renderHtml = (config: RawWidgetConfig, runtime: RuntimeConfig): string => {
    return renderToString(
        <div className="reactedge-usp">
            <BannerWidgetView rawConfig={config} runtimeConfig={runtime} />
        </div>
    );
};