import {createRoot} from "react-dom/client";
import {getMountedHost} from "./widget-runtime/lib/hostReader.ts";
import {ActivityContextProvider} from "./activity/Context/ActivityContextProvider.tsx";
import {WidgetWrapper} from "./WidgetWrapper.tsx";

export function mountWidget(hostElement: HTMLElement, rawConfig: unknown) {
    const mountedHost = getMountedHost(hostElement);

    createRoot(mountedHost).render(<ActivityContextProvider hostElement={hostElement}>
        <WidgetWrapper rawConfig={rawConfig} />
    </ActivityContextProvider>);
}
