import type {ReactEdgeRuntime} from "../runtime.ts";

export {};

declare global {
    interface Window {
        ReactEdgeRuntime: ReactEdgeRuntime;
        React: any;
        ReactDOM: any;
    }
}
