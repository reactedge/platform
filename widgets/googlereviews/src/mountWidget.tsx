import {getMountedHost} from "./lib/hostReader.ts";
import {ActivityContextProvider} from "./activity/Context/ActivityContextProvider.tsx";
import {WidgetWrapper} from "./WidgetWrapper.tsx";
import {createRoot} from "react-dom/client";

export async function mountWidget(hostElement: HTMLElement, rawConfig: unknown, runtimeConfig: unknown) {
    const mountedHost = getMountedHost(hostElement);

    createRoot(mountedHost).render(<ActivityContextProvider hostElement={hostElement}>
        <WidgetWrapper rawConfig={rawConfig} runtimeConfig={runtimeConfig} />
    </ActivityContextProvider>);
}
