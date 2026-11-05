import { renderToString } from 'react-dom/server';
import {WIDGET_ID} from "../../Config.ts";
import { WidgetView } from "../../WidgetView.tsx";
import type {ReactEdgeRuntimeConfig} from "../../domain/contact.types.ts";

export const renderHtml = (config: unknown, runtime: ReactEdgeRuntimeConfig, bootstrap: unknown): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={config} runtime={runtime} bootstrap={bootstrap} />
        </div>
    );
};

export { buildBootstrap } from '../../ssr/bootstrap';

export { loadRuntime } from '../../ssr/bootstrap';