export function resolveWidgetContainer(
    host: HTMLElement,
    selector: string,
    widgetName?: string
): HTMLElement | null {
    const root = host.getRootNode();

    const container =
        root instanceof ShadowRoot
            ? (root.host as HTMLElement).closest(selector)
            : host.closest(selector);

    if (!container && widgetName) {
        console.warn(`[${widgetName}] ${selector} container not found`);
    }

    return container as HTMLElement | null;
}
