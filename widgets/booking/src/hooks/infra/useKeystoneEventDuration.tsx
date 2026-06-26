import {useCallback, useEffect, useState} from "react";
import {getError} from "../../lib/error.ts";
import type {KeystoneEventCalculationParams} from "../../types/infra/keystone";
import {useSystemState} from "../../state/System/useSystemState.ts";

const QUERY = `
    query CalculateEventDuration($eventTypeId: ID!, $eventId: ID!, $shampoo: Int) {
      calculateEventDuration(eventTypeId: $eventTypeId, eventId: $eventId, shampoo: $shampoo)
    }
`;

export const useKeystoneEventDuration = ({
     eventId,
     eventTypeId
 }: KeystoneEventCalculationParams) => {
    const ready = !!eventId && !!eventTypeId;

    const [data, setData] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const load = useCallback(async () => {
        if (!ready) return;

        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<{
                calculateEventDuration: string;
            }>(QUERY, {
                eventId,
                eventTypeId,
                shampoo: 0,
            });

            setData(result.calculateEventDuration);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    }, [ready, eventId, eventTypeId]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        duration: data,
        loadingDuration: loading,
        errorDuration: error,
        refetch: load,
    };
};
