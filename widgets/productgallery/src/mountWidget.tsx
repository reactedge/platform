import {createRoot} from "react-dom/client";
import {ActivityContextProvider} from "./activity/Context/ActivityContextProvider.tsx";
import {getMountedHost} from "./lib/hostReader.ts";
import WidgetWrapper from "./WidgetWrapper.tsx";
import type {ReactEdgeRuntimeConfig} from "./components/Types.ts";

export function mountWidget(hostElement: HTMLElement, rawConfig: unknown, runtimeConfig: ReactEdgeRuntimeConfig) {
    const mountedHost = getMountedHost(hostElement);

    createRoot(mountedHost).render(<ActivityContextProvider hostElement={hostElement}>
        <WidgetWrapper rawConfig={rawConfig} runtimeConfig={runtimeConfig} />
    </ActivityContextProvider>);
}
