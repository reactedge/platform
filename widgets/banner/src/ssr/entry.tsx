import { renderToString } from 'react-dom/server';
import {WIDGET_ID} from "../Config.ts";
import {WidgetView} from "../WidgetView.tsx";

export const renderHtml = (config: unknown): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView rawConfig={config}/>
        </div>
    );
};