// infra/keystone/useKeystoneEventTypeGroups.ts
import { useEffect, useState } from "react";
import {getError} from "../../lib/error.ts";
import type {KeystoneVenue} from "../../types/infra/keystone";
import {useSystemState} from "../../state/System/useSystemState.ts";

const QUERY = `
  query Venues($where: VenueWhereInput!) {
      venues(where: $where) {
        name
        id
        code
      }
    }
`;

export function useKeystoneVenue(venueCode: string) {
    const [data, setData] = useState<KeystoneVenue>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const load = async () => {
        if (!venueCode) return;

        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<{
                venues: KeystoneVenue[];
            }>(QUERY, {
                where: { code: { equals: venueCode } },
            });

            if (!result.venues || result.venues.length === 0) {
                throw new Error(`Venue with code "${venueCode}" was not found`);
            }

            setData(result.venues[0]);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return { keystoneVenue: data, loading, error, refetch: load };
}
