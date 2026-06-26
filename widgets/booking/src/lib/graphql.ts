// infra/graphqlClient.ts
import {activity} from "../activity";

export type GraphqlClient = <T>(
    query: string,
    variables?: Record<string, unknown>
) => Promise<T>;

export function createGraphqlClient(apiEndpoint: string) {
    return async function graphqlRequest<T>(
        query: string,
        variables?: Record<string, unknown>
    ): Promise<T> {
        const res = await fetch(apiEndpoint, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!res.ok) {
            activity(
                "graphql",
                "GraphQL error",
                { api_endpoint: apiEndpoint, query, variables },
                "error"
            );
            throw new Error(`Network error: ${res.status}`);
        }

        const json = await res.json();

        if (json.errors) {
            activity(
                "graphql",
                "GraphQL json parsing",
                { res: json },
                "error"
            );
            throw new Error(json.errors.map((e: any) => e.message).join(", "));
        }

        return json.data;
    };
}

export function asVariables<T extends object>(vars: T): Record<string, unknown> {
    return vars as unknown as Record<string, unknown>;
}