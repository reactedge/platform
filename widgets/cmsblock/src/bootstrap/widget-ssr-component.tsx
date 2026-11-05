import { WIDGET_ID } from "./config/Config.ts";
import type { ReactEdgeRuntimeConfig } from "./config/Config.ts";
import type { BootstrapData } from "./ssr/render.tsx";
import { WidgetView } from "./view/WidgetView.tsx";

interface WidgetRootProps {
    contract: unknown;
    runtime: ReactEdgeRuntimeConfig;
    bootstrap: BootstrapData;
}

export function WidgetComponent({ contract, runtime, bootstrap }: WidgetRootProps) {
    return (
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={contract} runtime={runtime} bootstrapData={bootstrap} />
        </div>
    );
}
