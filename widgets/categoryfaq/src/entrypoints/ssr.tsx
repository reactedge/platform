import { renderToString } from 'react-dom/server';
import type {WidgetConfig} from "../Config.ts";
import {WidgetView} from "../WidgetView.tsx";
import {WIDGET_ID} from "../Config.ts";

export const renderHtml = (config: WidgetConfig, bootstrap?: unknown): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={config} bootstrap={bootstrap}/>
        </div>
    );
};
