import React from 'react';
import { renderToString } from 'react-dom/server';
import type {WidgetConfig} from "../domain/megamenu.types.ts";
import {MegamenuWidgetView} from "../MegamenuWidgetView.tsx";

export const renderHtml = (config: WidgetConfig): string => {
    return renderToString(
        <div className="reactedge-megamenu">
            <MegamenuWidgetView rawConfig={config} />
        </div>
    );
};