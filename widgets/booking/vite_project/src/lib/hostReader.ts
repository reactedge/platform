import {bookingSystemStyles} from "../styles/booking-system.styles.ts";
import {injectStyles} from "./style.ts";

export function getMountedHost(hostElement: HTMLElement) {
    //hostElement.classList.add(`reactedge-${WIDGET_ID}`);
    //return hostElement;
    const shadow =
        hostElement.shadowRoot || hostElement.attachShadow({ mode: "open" });

    for (const css of bookingSystemStyles) {
        injectStyles(shadow, css);
    }

    return shadow
}