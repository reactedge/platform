import {WIDGET_ID} from "./config/Config.ts";
import {WidgetView} from "./view/WidgetView.tsx";
interface WidgetRootProps {
    contract: unknown;
    hostElement?: HTMLElement;
}

export function WidgetComponent({
       contract
   }: WidgetRootProps) {
    return (
        <div className={`reactedge-${WIDGET_ID}`}>
            <WidgetView contract={contract} />
        </div>
    );
}