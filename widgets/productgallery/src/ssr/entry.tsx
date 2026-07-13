import { renderToString } from 'react-dom/server';
import { WIDGET_ID } from "../Config.ts";
import type { GalleryTile, ReactEdgeRuntimeConfig } from "../components/Types.ts";
import { WidgetView } from "../WidgetView.tsx";

export interface BootstrapData {
    galleryData: GalleryTile[]
}

export const renderHtml = (config: unknown, runtimeConfig: ReactEdgeRuntimeConfig, bootstrap: BootstrapData): string => {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView rawConfig={config} runtimeConfig={runtimeConfig} bootstrapData={bootstrap} />
        </div>
    );
};

export { buildBootstrap } from './bootstrap';

export { loadRuntime } from './bootstrap';