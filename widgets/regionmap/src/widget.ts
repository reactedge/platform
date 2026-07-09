import {mountWidget} from "./mountWidget.tsx";
import type { ReactEdgeRuntimeConfig} from "./domain/regionmap.types.ts";
import {WIDGET_ID} from "./Config.ts";

const mount = async (el: HTMLElement, config: unknown, runtimeConfig: ReactEdgeRuntimeConfig) => {
    await mountWidget(el, config, runtimeConfig)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };