export function getMountedHost(hostElement: HTMLElement) {
    return hostElement;
    const shadow =
        hostElement.shadowRoot || hostElement.attachShadow({ mode: "open" });

    return shadow
}