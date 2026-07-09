import {createRoot} from "react-dom/client";
import {WidgetWrapper} from "./WidgetWrapper.tsx";
import {getMountedHost} from "./lib/hostReader.ts";
import {ActivityContextProvider} from "./activity/Context/ActivityContextProvider.tsx";
import type {ReactEdgeRuntimeConfig} from "./domain/contact.types.ts";
import type {RawWidgetConfig} from "./domain/raw.contact.types.ts";

export async function mountWidget(hostElement: HTMLElement, config: RawWidgetConfig, runtimeConfig: ReactEdgeRuntimeConfig) {
    const mountedHost = getMountedHost(hostElement);

    createRoot(mountedHost).render(<ActivityContextProvider hostElement={hostElement}>
        <WidgetWrapper rawConfig={config} runtimeConfig={runtimeConfig} />
    </ActivityContextProvider>);
}
