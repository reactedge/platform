import {hydrateRoot} from "react-dom/client";
import type {ReactEdgeRuntimeConfig} from "../domain/intent-discovery.types.ts";
import {WidgetWrapper} from "../WidgetWrapper.tsx";

export async function mountWidget(hostElement: HTMLElement, config: unknown, runtimeConfig: ReactEdgeRuntimeConfig) {
    const mountedHost = hostElement;

    hydrateRoot(
        mountedHost,
        <WidgetWrapper rawConfig={config} runtimeConfig={runtimeConfig} />
    );
}
