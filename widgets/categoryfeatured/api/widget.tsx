import "../src/styles/widget.css";
import {WIDGET_ID} from "../src/Config.ts";
import {ElementHostProvider} from "@reactedge/framework/host.ts";
import type {WidgetApi} from "@reactedge/public-api/widget.ts";
import {createRoot} from "react-dom/client";
import {WidgetRoot} from "../src/bootstrap/widget-root.tsx";


const mount = (
    el: HTMLElement,
    contract: unknown,
    bootstrap: unknown
) => {
    const hostProvider = new ElementHostProvider(WIDGET_ID)

    createRoot(hostProvider.getMountedHost(el)).render(
        <WidgetRoot
            hostElement={el}
            contract={contract}
            bootstrap={bootstrap}
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