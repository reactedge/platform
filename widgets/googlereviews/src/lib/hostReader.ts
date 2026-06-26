import {injectStyles} from "./style.ts";
import {googleReviewsStyles} from "../styles/google-reviews.styles.ts";

export function getMountedHost(hostElement: HTMLElement) {
    const shadow =
        hostElement.shadowRoot || hostElement.attachShadow({ mode: "open" });

    for (const css of googleReviewsStyles) {
        injectStyles(shadow, css);
    }

    return shadow
}