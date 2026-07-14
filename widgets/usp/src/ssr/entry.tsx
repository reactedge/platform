import { renderToString } from 'react-dom/server';
import {type RuntimeConfig, WIDGET_ID, type WidgetConfig} from "../Config.ts";
import {WidgetView} from "./WidgetView.tsx";

export const renderHtml = (config: WidgetConfig, runtimeConfig: RuntimeConfig): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView rawConfig={config} runtimeConfig={runtimeConfig} />
        </div>
    );
};