import React from 'react';
import { renderToString } from 'react-dom/server';
import type {RuntimeConfig, WidgetConfig} from "../Config.ts";
import {UspWidgetView} from "../UspWidgetView.tsx";

export const renderHtml = (config: WidgetConfig, runtimeConfig: RuntimeConfig): string => {
    return renderToString(
        <div className="reactedge-usp">
            <UspWidgetView rawConfig={config} runtimeConfig={runtimeConfig} />
        </div>
    );
};