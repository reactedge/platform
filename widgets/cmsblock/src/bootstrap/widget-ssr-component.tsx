import { WIDGET_ID } from "../Config.ts";
import type { ReactEdgeRuntimeConfig } from "../Config.ts";
import type { BootstrapData } from "../entrypoints/ssr.tsx";
import { WidgetView } from "../WidgetView.tsx";

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
