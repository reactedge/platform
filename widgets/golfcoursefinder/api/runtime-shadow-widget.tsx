import { WIDGET_ID } from "../src/Config.ts";

import type { WidgetApi } from "@reactedge/public-api/widget";
import type {ReactEdgeRuntimeConfig} from "@reactedge/public-api/runtime.ts";

import {ShadowHostProvider} from "@reactedge/framework/host.ts";
import {createRoot} from "react-dom/client";
import {WidgetRoot} from "../src/bootstrap/widget-root.tsx"
import {styles} from "../src/styles/entry.ts";

const mount = (
    el: HTMLElement,
    contract: unknown,
    bootstrap: unknown,
    runtime: ReactEdgeRuntimeConfig
) => {
    const hostProvider = new ShadowHostProvider(styles)

    createRoot(hostProvider.getMountedHost(el)).render(
        <WidgetRoot
            hostElement={el}
            contract={contract}
            bootstrap={bootstrap}
            runtime={runtime}
        />
    )
};

const api: WidgetApi = {
    mount,
};

if (typeof window !== "undefined") {
    window[`ReactEdge_${WIDGET_ID}`] = api;
}

export { mount };