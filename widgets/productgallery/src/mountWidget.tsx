import {createRoot} from "react-dom/client";
import {ActivityContextProvider} from "./activity/Context/ActivityContextProvider.tsx";
import {getMountedHost} from "./lib/hostReader.ts";
import WidgetWrapper from "./WidgetWrapper.tsx";

export function mountWidget(hostElement: HTMLElement, rawConfig: unknown) {
    const mountedHost = getMountedHost(hostElement);

    createRoot(mountedHost).render(<ActivityContextProvider hostElement={hostElement}>
        <WidgetWrapper rawConfig={rawConfig} />
    </ActivityContextProvider>);
}
