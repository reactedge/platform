// infra/graphqlClient.ts
import {activity} from "../activity";
import { normalizeGraphqlResponse } from "./graphqlResponseNormalizer";

export type GraphqlClient = <T>(
    query: string,
    variables?: Record<string, unknown>
) => Promise<T>;

export function createGraphqlClient(apiEndpoint: string, storeCode: string) {
    return async function graphqlRequest<T>(
        query: string,
        variables?: Record<string, unknown>
    ): Promise<T> {
        const res = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Store": storeCode
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

        const text = await res.text();

        let json: { data: T };

        try {
            json = JSON.parse(text);
        } catch (e) {
            activity('graphql-failed-query', 'GraphQL Failed query', { api_endpoint: apiEndpoint, query, variables }, 'error');
            activity('graphql-invalid-json', 'GraphQL returned non-JSON response', {
                endpoint: apiEndpoint,
                status: res.status,
                textSnippet: text.slice(0, 500)
            });

            json = normalizeGraphqlResponse(text);
            activity('graphql-invalid-json', 'GraphQL failed raw text', {
                endpoint: apiEndpoint,
                status: res.status,
                textSnippet: text
            });
            activity('graphql-invalid-json', 'GraphQL patched response', {
                endpoint: apiEndpoint,
                status: res.status,
                json: json
            });
        }

        return json?.data;
    };
}

export function asVariables<T extends object>(vars: T): Record<string, unknown> {
    return vars as unknown as Record<string, unknown>;
}