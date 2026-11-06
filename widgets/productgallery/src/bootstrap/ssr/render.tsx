import { renderToString } from 'react-dom/server';
import { WIDGET_ID } from "../config/Config.ts";
import type { ReactEdgeRuntimeConfig } from "../../components/Types.ts";
import { WidgetView } from "../view/WidgetView.tsx";

export const renderHtml = (config: unknown, bootstrap: unknown, runtime: ReactEdgeRuntimeConfig): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={config} bootstrap={bootstrap} runtime={runtime} />
        </div>
    );
};

export { loadRuntime } from './bootstrap';