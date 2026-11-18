import { renderToString } from 'react-dom/server';
import type { WidgetConfig } from "../config/Config.ts";
import { WidgetView } from "../view/WidgetView.tsx";
import { WIDGET_ID } from "../config/Config.ts";

export const renderHtml = (config: WidgetConfig): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={config} />
        </div>
    );
};
