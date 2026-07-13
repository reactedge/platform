import type {GraphqlClient} from "../../services/graphql/graphqlClient.ts";

export interface SystemState {
    graphqlClient: GraphqlClient;
}