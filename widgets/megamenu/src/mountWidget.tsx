import {createRoot} from "react-dom/client";
import {WidgetWrapper} from "./WidgetWrapper.tsx";
import {getMountedHost} from "./lib/hostReader.ts";
import {ActivityContextProvider} from "./activity/Context/ActivityContextProvider.tsx";

export async function mountWidget(hostElement: HTMLElement, rawConfig: unknown) {
    const mountedHost = getMountedHost(hostElement);

    createRoot(mountedHost).render(<ActivityContextProvider hostElement={hostElement}>
        <WidgetWrapper rawConfig={rawConfig} />
    </ActivityContextProvider>);
}
