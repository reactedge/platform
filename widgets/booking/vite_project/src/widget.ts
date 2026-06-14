import {mountWidget, WIDGET_ID} from "./mountWidget";
import type {BookingConfig} from "./BookingSystemConfig.tsx";

const mount = async (el: HTMLElement, config: BookingConfig) => {
    await mountWidget(el, config)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };