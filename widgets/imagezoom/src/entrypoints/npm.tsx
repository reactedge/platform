import { Widget } from "../Widget.tsx";
import { ResourceLoader } from "@reactedge/framework/contract";
import { WidgetActivity } from "@reactedge/framework/activity";
import { WIDGET_ID } from "../Config.ts";

async function main() {
    const loader = new ResourceLoader();
    const activity = new WidgetActivity(WIDGET_ID)
    const contract = await loader.loadContract("default.json");
    const bootstrap = await loader.loadContract("data.json");
    const container = document.getElementById("root")!;

    const mode = __REACTEDGE_MODE__;

    if (mode === "hydrate") {
        activity.debug("Hydrating existing HTML", {
            contract,
            html: container.innerHTML
        });
    } else {
        activity.debug("Rendering from scratch");
    }

    if (mode === "hydrate") {
        Widget({
            container,
            contract,
            bootstrap,
            hydrate: true
        });
    } else {
        Widget({
            container,
            contract,
            bootstrap,
            hydrate: false
        });
    }
}

main();