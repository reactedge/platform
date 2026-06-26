import {hydrateRoot} from "react-dom/client";
import type {WidgetConfig} from "../domain/megamenu.types.ts";
import {WidgetWrapper} from "../WidgetWrapper.tsx";

export async function mountWidget(hostElement: HTMLElement, config: WidgetConfig) {
    const mountedHost = hostElement;

    hydrateRoot(
        mountedHost,
        <WidgetWrapper rawConfig={config} />
    );
}
