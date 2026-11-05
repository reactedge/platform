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
    return (
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={contract} bootstrap={bootstrap} />
        </div>
    );
}