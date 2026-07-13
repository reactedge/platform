import type {ReactEdgeRuntimeConfig} from "../components/Types.ts";

export async function loadRuntime(): Promise<ReactEdgeRuntimeConfig> {
    const response = await fetch("/reactedge-runtime.json");

    if (!response.ok) {
        throw new Error(
            `Unable to load ReactEdge runtime (${response.status})`
        );
    }

    return response.json() as Promise<ReactEdgeRuntimeConfig>;
}