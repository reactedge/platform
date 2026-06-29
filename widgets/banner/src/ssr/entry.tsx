import React from 'react';
import { renderToString } from 'react-dom/server';
import {type RawWidgetConfig, type RuntimeConfig, WIDGET_ID} from "../Config.ts";
import {WidgetView} from "../components/ssr/WidgetView.tsx";

export const renderHtml = (config: RawWidgetConfig, runtime: RuntimeConfig): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView rawConfig={config} runtimeConfig={runtime}/>
        </div>
    );
};