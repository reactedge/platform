import {mountWidget} from "./mountWidget.tsx";
import {WIDGET_ID} from "./Config.ts";

import type {RawWidgetConfig} from "./ConfigSchema.ts";
import type {ReactEdgeRuntimeConfig} from "./domain/contact.types.ts";

import "./styles/widget.css"

const mount = async (el: HTMLElement, config: RawWidgetConfig, runtimeConfig: ReactEdgeRuntimeConfig) => {
    await mountWidget(el, config, runtimeConfig)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };