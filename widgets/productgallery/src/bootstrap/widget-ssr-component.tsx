import {WIDGET_ID} from "./config/Config.ts";
import {WidgetView} from "./view/WidgetView.tsx";

interface WidgetRootProps {
    contract: unknown;
    bootstrap: unknown;
    hostElement?: HTMLElement;
}

export function WidgetComponent({
       contract,
       bootstrap
   }: WidgetRootProps) {
    const runtime = {
        rendering: {
            userAgent: 'desktop'
        }}

    return (
        <div data-reactedge-ssr className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={contract} bootstrap={bootstrap} runtime={runtime} />
        </div>
    );
}