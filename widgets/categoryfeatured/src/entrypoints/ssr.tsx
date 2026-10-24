import { renderToString } from 'react-dom/server';
import {WidgetView} from "../WidgetView.tsx";
import {WIDGET_ID} from "../Config.ts";

export const renderHtml = (
    contract: unknown,
    _runtime: unknown,
    bootstrap?: unknown,
): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={contract} bootstrap={bootstrap}/>
        </div>
    );
};