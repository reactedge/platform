// infra/keystone/useKeystoneEventTypeGroups.ts
import { useEffect, useState } from "react";
import {getError} from "../../lib/error.ts";
import type {KeystoneEventType} from "../../types/infra/keystone";
import {useSystemState} from "../../state/System/useSystemState.ts";

const QUERY = `
  query EventType($where: EventTypeWhereUniqueInput!) {
      eventType(where: $where) {
        id
        name
        description
        duration
      }
    }
`;

export function useKeystoneEventType(eventTypeId?: string) {
    const [data, setData] = useState<KeystoneEventType>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const load = async (eventTypeId?: string) => {
        if (!eventTypeId) return;

        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<{
                eventType: KeystoneEventType;
            }>(QUERY, { where: { id: eventTypeId } });

            setData(result.eventType);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(eventTypeId);
    }, [eventTypeId]);

    return { keystoneEventType: data, loading, error, refetch: load };
}
