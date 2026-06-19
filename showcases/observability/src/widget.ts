import {mountWidget} from "./mountWidget.tsx";

import "./styles/widget.css"
import {type RawWidgetConfig, WIDGET_ID} from "./Config.ts";

const mount = async (el: HTMLElement, config: RawWidgetConfig) => {
    await mountWidget(el, config)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };