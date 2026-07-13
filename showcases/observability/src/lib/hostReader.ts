import {WIDGET_ID} from "../Config.ts";

export function getMountedHost(hostElement: HTMLElement) {
    hostElement.classList.add(`reactedge-${WIDGET_ID}`);

    return hostElement;
}