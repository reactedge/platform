import { renderToString } from 'react-dom/server';
import type {WidgetConfig} from "../bootstrap/config/Config.ts";
import {WidgetView} from "../bootstrap/view/WidgetView.tsx";
import {WIDGET_ID} from "../bootstrap/config/Config.ts";

export const renderHtml = (config: WidgetConfig, bootstrap: unknown): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={config} bootstrap={bootstrap} />
        </div>
    );
};