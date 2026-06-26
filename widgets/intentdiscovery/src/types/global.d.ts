export {};

declare global {
    interface Window {
        __REACTEDGE_DEBUG__?: boolean;
    }
    interface Window {
        ReactEdgeSignals?: any[];
    }
}
