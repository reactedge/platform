export function getMountedHost(hostElement: HTMLElement) {
    const shadow =
        hostElement.shadowRoot || hostElement.attachShadow({ mode: "open" });

    return shadow
}