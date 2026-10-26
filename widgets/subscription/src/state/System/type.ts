import type {GraphqlClient} from "@reactedge/framework/graphql/graphqlClient.ts";

export interface SystemState {
    graphqlClient: GraphqlClient;
}