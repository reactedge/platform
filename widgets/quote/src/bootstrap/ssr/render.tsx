import { renderToString } from 'react-dom/server';
import { WIDGET_ID } from "../config/Config.ts";
import type { ReactEdgeRuntimeConfig } from "../config/Config.ts";
import { WidgetView } from "../view/WidgetView.tsx";

export const renderHtml = (config: unknown, runtime: ReactEdgeRuntimeConfig): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={config} runtime={runtime} />
        </div>
    );
};

export { buildBootstrap, loadRuntime } from './bootstrap';
