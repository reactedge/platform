import React from 'react';
import { renderToString } from 'react-dom/server';
import {type RawWidgetConfig, WIDGET_ID} from "../Config.ts";
import {WidgetView} from "../WidgetView.tsx";

export const renderHtml = (config: RawWidgetConfig): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView rawConfig={config}/>
        </div>
    );
};