import {mountWidget} from "./mountWidget.tsx";
import {WIDGET_ID} from "./Config.ts";

import "./styles/widget.css"

const mount = async (el: HTMLElement, config: unknown) => {
    await mountWidget(el, config)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };