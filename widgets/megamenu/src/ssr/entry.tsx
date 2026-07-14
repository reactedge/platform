import { renderToString } from 'react-dom/server';
import type {WidgetConfig} from "../domain/megamenu.types.ts";
import {WidgetView} from "./WidgetView.tsx";
import {WIDGET_ID} from "../Config.ts";

export const renderHtml = (config: WidgetConfig): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView rawConfig={config}/>
        </div>
    );
};