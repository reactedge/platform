export {};

declare global {
    interface Window {
        __REACTEDGE_DEBUG__?: boolean;
        [key: `ReactEdge_${string}`]: WidgetApi;
    }
    const __REACTEDGE_MODE__: "render" | "hydrate";
}
