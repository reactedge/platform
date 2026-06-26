// infra/keystone/useKeystoneEventTypeGroups.ts
import { useEffect, useState } from "react";
import {getError} from "../../lib/error.ts";
import type {KeystoneEventTypeGroup} from "../../types/infra/keystone";
import {useSystemState} from "../../state/System/useSystemState.ts";

const QUERY = `
  query VenueEventTypeGroups($venueId: ID!) {
    venueEventTypeGroups(venueId: $venueId) {
      id
      name
    }
  }
`;

export function useKeystoneEventTypeGroups(venueId?: string) {
    const [data, setData] = useState<KeystoneEventTypeGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const load = async () => {
        if (!venueId) return;

        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<{
                venueEventTypeGroups: KeystoneEventTypeGroup[];
            }>(QUERY, { venueId });

            setData(result.venueEventTypeGroups);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [venueId]);

    return {
        keystoneEventTypeGroups: data,
        keystoneEventTypeLoading: loading,
        keystoneEventTypeError: error,
        refetch: load };
}
