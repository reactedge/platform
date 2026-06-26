import {mountWidget, WIDGET_ID} from "./mountWidget";
import type {ContactUsRawConfig} from "./domain/contact.types.ts";

const mount = async (el: HTMLElement, config?: ContactUsRawConfig) => {
    await mountWidget(el, config)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };