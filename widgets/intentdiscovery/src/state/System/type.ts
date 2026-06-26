import type {IntentEngine} from "../../integration/intent/IntentEngine.ts";
import type {GraphqlClient} from "../../services/graphql/graphqlClient.ts";
import type {BootstrapData} from "../../ssr/entry.tsx";

export interface SystemState {
    graphqlClient: GraphqlClient;
    intentEngine: IntentEngine;
    bootstrap?: BootstrapData
}