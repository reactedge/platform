import {createRoot} from "react-dom/client";
import {IntentDiscoveryWidgetWrapper} from "./IntentDiscoveryWidgetWrapper.tsx";
import {activity} from "./activity";
import type {WidgetConfig} from "./IntentDiscoveryConfig.ts";
import type {ReactEdgeRuntimeConfig} from "./domain/intent-discovery.types.ts";
import {getMountedHost} from "./lib/hostReader.ts";

export function mountWidget(hostElement: HTMLElement, config: WidgetConfig, runtimeConfig: ReactEdgeRuntimeConfig) {
    const mountedHost = getMountedHost(hostElement);

    activity('bootstrap', 'Widget mounted', hostElement);

    const root = createRoot(mountedHost);
    root.render(<IntentDiscoveryWidgetWrapper rawConfig={config} runtimeConfig={runtimeConfig} />);
}
