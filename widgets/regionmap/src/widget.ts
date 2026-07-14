import { mountWidget } from "./mountWidget.tsx";
import { WIDGET_ID } from "./Config.ts";

import type { WidgetApi } from "../../../packages/widget-build/shared-resources/public-api/widget";
import type {ReactEdgeRuntimeConfig} from "../../../packages/widget-build/shared-resources/public-api/runtime.ts";

const mount = async (
    el: HTMLElement,
    rawConfig: unknown,
    runtime: ReactEdgeRuntimeConfig
) => {
    await mountWidget(el, rawConfig, runtime);
};

const api: WidgetApi = {
    mount,
};

if (typeof window !== "undefined") {
    (window as any)[`ReactEdge_${WIDGET_ID}`] = api;
}

export { mount };