import {WIDGET_ID} from "../Config.ts";
import {ActivityContextProvider} from "../activity/Context/ActivityContextProvider.tsx";
import {WidgetWrapper} from "./WidgetWrapper.tsx";
interface WidgetRootProps {
    contract: unknown;
    bootstrap: unknown;
    hostElement?: HTMLElement;
}

export function WidgetRoot({
       contract,
       bootstrap,
       hostElement,
   }: WidgetRootProps) {
    return (
        <div className={`reactedge-${WIDGET_ID}`}>
            <ActivityContextProvider
                {...(hostElement ? { hostElement } : {})}
            >
                <WidgetWrapper contract={contract} bootstrap={bootstrap} />
            </ActivityContextProvider>
        </div>
    );
}