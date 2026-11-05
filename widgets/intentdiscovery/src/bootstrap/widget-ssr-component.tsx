import { WIDGET_ID } from "../Config.ts";
import type { BootstrapData } from "./ssr/render.tsx";
import { WidgetView } from "../WidgetView.tsx";

interface WidgetRootProps {
    contract: unknown;
    hostElement?: HTMLElement;
}

export function WidgetComponent({
    contract
}: WidgetRootProps) {
    const runtime = {
        rendering: {
            userAgent: 'desktop'
        }
    }

    const bootstrapData: BootstrapData = {
        categoryData: null,
        layeredData: null
    }

    return (
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={contract} runtime={runtime} bootstrap={bootstrapData} />
        </div>
    );
}