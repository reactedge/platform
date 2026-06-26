import {mountWidget, WIDGET_ID} from "./mountWidget";
import type {RegionMapWidgetConfig} from "./domain/regionmap.types.ts";

const mount = async (el: HTMLElement, config: RegionMapWidgetConfig) => {
    await mountWidget(el, config)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };
