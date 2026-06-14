import {type WidgetConfig, WIDGET_ID} from "./IntentDiscoveryConfig.ts";
import {mountWidget} from "./mountWidget.tsx";
import type {ReactEdgeRuntimeConfig} from "./domain/intent-discovery.types.ts";

import "./styles/intent-discovery.css"

const mount = async (
    el: HTMLElement,
    config: WidgetConfig,
    runtimeConfig: ReactEdgeRuntimeConfig
) => {
    await mountWidget(el, config, runtimeConfig)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };
