import { mountWidget } from "./mountWidget.tsx";
import { WIDGET_ID } from "./Config.ts";
import type { WidgetApi } from "../../../packages/widget-build/shared-resources/public-api/widget";

import "./styles/widget.css";

const mount = async (
    el: HTMLElement,
    config: unknown,
    runtime: unknown
) => {
    await mountWidget(el, config, runtime);
};

const api: WidgetApi = {
    mount,
};

if (typeof window !== "undefined") {
    (window as any)[`ReactEdge_${WIDGET_ID}`] = api;
}

export { mount };