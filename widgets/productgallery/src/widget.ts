import {mountWidget} from "./mountWidget.tsx";
import {WIDGET_ID} from "./Config.ts";

import "./styles/widget.css"
import type {ReactEdgeRuntimeConfig} from "./components/Types.ts";

const mount = async (el: HTMLElement, config: unknown,  runtimeConfig: ReactEdgeRuntimeConfig) => {
    await mountWidget(el, config, runtimeConfig)
}

const api = { mount };

if (typeof window !== 'undefined') {
    (window as any)[`ReactEdge_${WIDGET_ID}`] = api;
}

export { mount };