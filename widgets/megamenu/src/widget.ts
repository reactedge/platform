import {mountWidget} from "./mountWidget.tsx";
import {WIDGET_ID, type RawWidgetConfig} from "./Config.ts";

import "./styles/widget.css"

const mount = async (el: HTMLElement, config: RawWidgetConfig) => {
    await mountWidget(el, config)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };