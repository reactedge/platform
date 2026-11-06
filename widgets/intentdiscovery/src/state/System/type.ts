import type { GraphqlClient } from "@reactedge/framework/graphql/graphqlClient.ts";
import type { BootstrapData } from "../../bootstrap/ssr/render.tsx";
import type { IntentEngine } from "../../integration/intent/IntentEngine.ts";

export interface SystemState {
    graphqlClient: GraphqlClient;
    intentEngine: IntentEngine;
    bootstrap?: BootstrapData | undefined;
}