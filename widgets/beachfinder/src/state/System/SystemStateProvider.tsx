import { useMemo, type ReactNode } from "react";
import type { SchemaRuntimeConfig } from "../../ConfigSchemaRuntime.ts";
import { createBeachFinderApiClient } from "../../services/beachfinder/BeachFinderApi.ts";
import { LocalSystemStateContext } from "./SystemState.tsx";

type Props = {
    children: ReactNode;
    config: SchemaRuntimeConfig["integrations"];
};

export function SystemStateProvider({ children, config }: Props) {
    const apiUrl = config.beachfinderApi.api;
    const beachFinderApi = useMemo(
        () => createBeachFinderApiClient(apiUrl),
        [apiUrl]
    );
    return (
        <LocalSystemStateContext.Provider value={{ beachFinderApi }}>
            {children}
        </LocalSystemStateContext.Provider>
    );
}
