import {WidgetRoot} from "./bootstrap/widget-root.tsx";
import {createRoot, hydrateRoot} from "react-dom/client";
import type {RuntimeWidgetOptions} from "@reactedge/public-api/WidgetOptions.ts";

export function Widget({
   container,
   contract,
   bootstrap,
   runtime,
   hydrate = false,
}: RuntimeWidgetOptions) {
    const element = (
        <WidgetRoot contract={contract} bootstrap={bootstrap} runtime={runtime} />
    );

    if (hydrate) {
        hydrateRoot(container, element);
    } else {
        createRoot(container).render(element);
    }
}