import {WidgetRoot} from "./bootstrap/widget-root.tsx";
import {createRoot} from "react-dom/client";
import type {RuntimeWidgetOptions} from "@reactedge/public-api/WidgetOptions.ts";
import {ShadowHostProvider} from "@reactedge/framework/host.ts";
import { styles } from "./styles/entry.ts";

export function Widget({
   container,
   contract,
   runtime
}: RuntimeWidgetOptions) {
    const hostProvider = new ShadowHostProvider(styles);
    const host = hostProvider.getMountedHost(container);

    createRoot(host).render(
        <WidgetRoot
            contract={contract}
            runtime={runtime}
        />
    );
}