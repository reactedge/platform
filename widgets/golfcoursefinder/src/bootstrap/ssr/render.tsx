import { renderToString } from "react-dom/server";
import { WIDGET_ID, type ReactEdgeRuntimeConfig } from "../config/Config.ts";
import { WidgetView } from "../view/WidgetView.tsx";

export function renderHtml(
    contract: unknown,
    runtime: ReactEdgeRuntimeConfig,
): string {
    return renderToString(
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={contract} runtime={runtime} />
        </div>,
    );
}

export { buildBootstrap, loadRuntime } from "./bootstrap.ts";
