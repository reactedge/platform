import {hydrateRoot} from "react-dom/client";
import {WidgetWrapper} from "../WidgetWrapper.tsx";

export async function mountWidget(hostElement: HTMLElement, config: unknown) {
    const mountedHost = hostElement;

    hydrateRoot(
        mountedHost,
        <WidgetWrapper rawConfig={config} />
    );
}
