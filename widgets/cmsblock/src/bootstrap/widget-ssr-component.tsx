import {WIDGET_ID} from "../Config.ts";
import {WidgetView} from "../WidgetView.tsx";
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