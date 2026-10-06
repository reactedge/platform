import {WIDGET_ID} from "../Config.ts";
import {ActivityContextProvider} from "../activity/Context/ActivityContextProvider.tsx";
import WidgetWrapper from "./WidgetWrapper.tsx";

interface WidgetRootProps {
    contract: unknown;
    runtime: unknown;
    bootstrap?: unknown;
    hostElement?: HTMLElement;
}

export function WidgetRoot({
   contract,
   runtime,
   hostElement,
}: WidgetRootProps) {
    return (
        <div className={`reactedge-${WIDGET_ID}`}>
            <ActivityContextProvider
                {...(hostElement ? { hostElement } : {})}
            >
                <WidgetWrapper contract={contract} runtime={runtime} />
            </ActivityContextProvider>
        </div>
    );
}