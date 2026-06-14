import type {WidgetConfig} from "../IntentDiscoveryConfig.ts";
import {activity} from "../activity";
import {hydrateRoot} from "react-dom/client";
import {IntentDiscoveryWidgetWrapper} from "../IntentDiscoveryWidgetWrapper.tsx";
import type {ReactEdgeRuntimeConfig} from "../domain/intent-discovery.types.ts";

export async function mountWidget(hostElement: HTMLElement, config: WidgetConfig, runtimeConfig: ReactEdgeRuntimeConfig) {
    const mountedHost = hostElement;

    activity('bootstrap', 'Widget mounted', hostElement);

    hydrateRoot(
        mountedHost,
        <IntentDiscoveryWidgetWrapper rawConfig={config} runtimeConfig={runtimeConfig} />
    );
}
