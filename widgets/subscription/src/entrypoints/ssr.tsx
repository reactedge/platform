import { renderToString } from 'react-dom/server';
import {WIDGET_ID} from "../Config.ts";
import type { ReactEdgeRuntimeConfig, ProductData } from "../Config.ts";
import { WidgetView } from "../WidgetView.tsx";

export interface BootstrapData {
    productData: ProductData | undefined;
}

export const renderHtml = (config: unknown, runtime: ReactEdgeRuntimeConfig, bootstrap: BootstrapData): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={config} runtime={runtime} bootstrapData={bootstrap} />
        </div>
    );
};

export { buildBootstrap } from '../ssr/bootstrap';

export { loadRuntime } from '../ssr/bootstrap';