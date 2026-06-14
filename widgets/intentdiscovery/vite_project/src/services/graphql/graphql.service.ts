// services/graphql/graphqlService.ts

import { createGraphqlClient } from "./graphqlClient";
import {getCache, getCacheKey, setCache} from "./graphqlCache";

type GraphqlOptions = {
    cache?: boolean;
    ttl?: number;
};

const inFlight = new Map<string, Promise<any>>();

export function createGraphqlService(apiEndpoint: string, storeCode: string) {
    const request = createGraphqlClient(apiEndpoint, storeCode);

    return async function query<T>(
        query: string,
        variables?: Record<string, unknown>,
        options: GraphqlOptions = { cache: true, ttl: 60000 }
    ): Promise<T> {
        const { cache = true, ttl = 60000 } = options;

        if (!cache) {
            console.log('graphql service not cached', query)
            return request<T>(query, variables);
        }

        const key = getCacheKey(query, variables, storeCode);

        // 1. Try cache
        const cached = getCache(key, ttl);
        if (cached) {
            return cached;
        }

        // 2. Deduplicate in-flight requests
        if (inFlight.has(key)) {
            return inFlight.get(key);
        }

        const promise = request<T>(query, variables)
            .then((data) => {
                setCache(key, data);
                inFlight.delete(key);
                return data;
            })
            .catch((err) => {
                inFlight.delete(key);

                // fallback to stale cache if available
                const stale = getCache(key, Infinity);
                if (stale) return stale;

                throw err;
            });

        inFlight.set(key, promise);

        return promise;
    };
}