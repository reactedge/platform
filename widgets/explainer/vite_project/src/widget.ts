import {mountWidget, WIDGET_ID} from "./mountWidget";
import type {WidgetConfig} from "./ExplainerConfig.ts";

const mount = async (el: HTMLElement, config: WidgetConfig) => {
    await mountWidget(el, config)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };