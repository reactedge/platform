// infra/keystone/useKeystoneEventTypeGroups.ts
import { useEffect, useState } from "react";
import type {EventFilterState} from "../../types/domain/event.type.ts";
import {getError} from "../../lib/error.ts";
import type {KeystoneEvent} from "../../types/infra/keystone";
import {useSystemState} from "../../state/System/useSystemState.ts";

const QUERY = `
  query Events($orderBy: [EventOrderByInput!]!, $where: EventWhereInput!, $skip: Int = 0, $take: Int) {
      events(orderBy: $orderBy, where: $where, skip: $skip, take: $take) {
        id      
        startTime
        venue {
          name
        }
        status
        endTime       
        eventHost {
          id
          name
        }
        day
        orderItem {
          event {
            id
          }
        }
      }
    }
`;

export function useKeystoneEvents(filter: EventFilterState, versionNumber: number) {
    const [data, setData] = useState<KeystoneEvent[]>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const load = async (filter: EventFilterState) => {
        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<{
                events: KeystoneEvent[];
            }>(QUERY, { where: filter, orderBy: [{ startTime: "asc" }] });

            setData(result.events);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(filter);
    }, [filter, versionNumber]);

    return { keystoneEvents: data, loading, error, refetch: load };
}
