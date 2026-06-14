import React from 'react';
import { renderToString } from 'react-dom/server';
import type {RawWidgetConfig} from "../Config.ts";
import {BannerWidgetView} from "../BannerWidgetView.tsx";

export const renderHtml = (config: RawWidgetConfig): string => {
    return renderToString(
        <div className="reactedge-usp">
            <BannerWidgetView rawConfig={config} />
        </div>
    );
};