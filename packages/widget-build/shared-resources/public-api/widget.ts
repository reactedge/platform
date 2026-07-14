/**
 * Public browser API exposed by every ReactEdge widget.
 */
export interface WidgetApi {
    /**
     * Mounts the widget into the supplied host element.
     *
     * The configuration is treated as untrusted input and must be
     * validated before rendering.
     */
    mount(
        element: HTMLElement,
        config: unknown,
        runtimeConfig: unknown
    ): Promise<void>;
}