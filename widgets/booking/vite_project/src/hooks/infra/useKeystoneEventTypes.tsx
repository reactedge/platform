// infra/keystone/useKeystoneEventTypeGroups.ts
import { useEffect, useState } from "react";
import {getError} from "../../lib/error.ts";
import type {KeystoneEventType} from "../../types/infra/keystone";
import {useSystemState} from "../../state/System/useSystemState.ts";

const QUERY = `
  query EventTypes($where: EventTypeWhereInput!, $orderBy: [EventTypeOrderByInput!]!) {
      eventTypes(where: $where, orderBy: $orderBy) {
        id
        name
        description
        duration
      }
    }
`;

export function useKeystoneEventTypes(groupId?: string) {
    const [data, setData] = useState<KeystoneEventType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const load = async (groupId?: string) => {
        if (!groupId) return;

        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<{
                eventTypes: KeystoneEventType[];
            }>(QUERY, {
                where: { group: { id: { equals: groupId } } },
                orderBy: [ { name: "asc" } ] }
            );

            setData(result.eventTypes);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(groupId);
    }, [groupId]);

    return { keystoneEventTypes: data, loading, error, refetch: load };
}
