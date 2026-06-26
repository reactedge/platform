import {mountWidget} from "./mountWidget.tsx";
import {WIDGET_ID, type RawWidgetConfig} from "./Config.ts";

import type {ReactEdgeRuntimeConfig} from "./domain/googlereviews.types.ts";

const mount = async (el: HTMLElement, config: RawWidgetConfig, runtimeConfig: ReactEdgeRuntimeConfig) => {
    await mountWidget(el, config, runtimeConfig)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };