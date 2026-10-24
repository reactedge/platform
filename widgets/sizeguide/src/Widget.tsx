import {WidgetRoot} from "./bootstrap/widget-root.tsx";
import {createRoot, hydrateRoot} from "react-dom/client";
import type {StaticWidgetOptions} from "@reactedge/public-api/WidgetOptions.ts";

export function Widget({
       container,
       contract,
       bootstrap,
       hydrate = false,
   }: StaticWidgetOptions) {
    const element = (
        <WidgetRoot contract={contract} bootstrap={bootstrap} />
    );

    if (hydrate) {
        hydrateRoot(container, element);
    } else {
        createRoot(container).render(element);
    }
}