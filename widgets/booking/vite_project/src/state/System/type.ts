import type {GraphqlClient} from "../../lib/graphql.ts";

export interface SystemState {
    cloudflareKey: string
    graphqlClient: GraphqlClient,
    isTurnstileEnabled: () => boolean
}