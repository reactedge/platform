import { renderToString } from "react-dom/server";
import { WIDGET_ID, type ReactEdgeRuntimeConfig } from "../Config.ts";
import { WidgetView } from "../WidgetView.tsx";

export function renderHtml(
    contract: unknown,
    _bootstrap: unknown,
    runtime: ReactEdgeRuntimeConfig,
): string {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={contract} runtime={runtime} />
        </div>,
    );
}

export { buildBootstrap, loadRuntime } from "../ssr/bootstrap.ts";
