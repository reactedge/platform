import { renderToString } from "react-dom/server";
import type { ReactEdgeRuntimeConfig } from "../config/Config.ts";
import type { CmsBlockBootstrap } from "../../services/cmsblock/CmsBlockApi.ts";
import { WIDGET_ID } from "../config/Config.ts";
import { WidgetView } from "../view/WidgetView.tsx";

/** Signature required by the platform SSR worker: renderHtml(contract, bootstrap, runtime). */
export const renderHtml = (
    contract: unknown,
    bootstrap: CmsBlockBootstrap,
    runtime: ReactEdgeRuntimeConfig
): string => renderToString(
    <div className={`reactedge-${WIDGET_ID}`}>
        <WidgetView contract={contract} runtime={runtime} bootstrapData={bootstrap} />
    </div>
);

export { buildBootstrap, loadRuntime } from "../../ssr/bootstrap.ts";
