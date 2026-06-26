import {hydrateRoot} from "react-dom/client";
import type {RawWidgetConfig} from "../Config.ts";
import {WidgetWrapper} from "../WidgetWrapper.tsx";

export async function mountWidget(hostElement: HTMLElement, config: RawWidgetConfig) {
    const mountedHost = hostElement;

    hydrateRoot(
        mountedHost,
        <WidgetWrapper rawConfig={config} />
    );
}
