import {injectStyles} from "../../lib/style.ts";
import {trustpilotStyles} from "../../styles/trustpilot.styles.ts";

export function getMountedHost(hostElement: HTMLElement) {
    //hostElement.classList.add(`reactedge-${WIDGET_ID}`);
    //return hostElement
    const shadow =
        hostElement.shadowRoot || hostElement.attachShadow({ mode: "open" });

    for (const css of trustpilotStyles) {
        injectStyles(shadow, css);
    }
    return shadow
}