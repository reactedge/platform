import { renderToString } from 'react-dom/server';
import {WIDGET_ID} from "../Config.ts";
import type { ReactEdgeRuntimeConfig } from "../Config.ts";
import { WidgetView } from "../WidgetView.tsx";

function isRuntimeConfig(value: unknown): value is ReactEdgeRuntimeConfig {
    return typeof value === "object" && value !== null && "integrations" in value && "context" in value;
}

export const renderHtml = (config: unknown, runtimeOrBootstrap: unknown, possibleRuntime?: unknown): string => {
    const runtime = isRuntimeConfig(runtimeOrBootstrap)
        ? runtimeOrBootstrap
        : isRuntimeConfig(possibleRuntime)
            ? possibleRuntime
            : null;
    if (!runtime) throw new Error("Quote SSR requires runtime configuration");

    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={config} runtime={runtime} />
        </div>
    );
};

export { buildBootstrap, loadRuntime } from '../ssr/bootstrap';
