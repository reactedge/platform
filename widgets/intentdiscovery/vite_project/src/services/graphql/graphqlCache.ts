// services/graphql/graphqlCache.ts

const TTL = 60 * 60 * 1000;

export function getCache(key: string, ttl: number = TTL) {
    if (typeof sessionStorage === 'undefined') {
        return null;
    }

    const raw = sessionStorage.getItem(key);
    if (!raw) return null;

    const { data, timestamp } = JSON.parse(raw);

    if (Date.now() - timestamp > ttl) {
        return null;
    }

    return data;
}

export function setCache(key: string, data: any) {
    if (typeof sessionStorage === 'undefined') {
        return;
    }

    sessionStorage.setItem(
        key,
        JSON.stringify({
            data,
            timestamp: Date.now()
        })
    );
}

export function getCacheKey(
    query: string,
    variables: any,
    storeCode: string
) {
    return `reactedge:gql:${storeCode}:${btoa(query)}:${JSON.stringify(variables)}`;
}