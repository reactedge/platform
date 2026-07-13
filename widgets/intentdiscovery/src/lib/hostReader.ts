import {intentdiscoveryStyles} from "../styles/intentdiscovery.styles.ts";
import {injectStyles} from "./style.ts";

export function getMountedHost(hostElement: HTMLElement) {
    const shadow =
        hostElement.shadowRoot || hostElement.attachShadow({ mode: "open" });

    for (const css of intentdiscoveryStyles) {
        injectStyles(shadow, css);
    }

    return shadow
}