import {useCallback, useState} from "react";
import type {KeystoneCartEventParams} from "../../types/infra/keystone";
import {useSystemState} from "../../state/System/useSystemState.ts";

const MUTATION = `
    mutation AddToCart($eventId: ID!, $eventTypeId: ID!, $shampoo: Int, $userId: ID!) {
      addToCart(eventId: $eventId, eventTypeId: $eventTypeId, shampoo: $shampoo, userId: $userId)
    }
`;

export const useKeystoneAddToCart = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const addToCart = useCallback(
        async (variables: KeystoneCartEventParams) => {
            setLoading(true);
            setError(null);

            try {
                const result = await graphqlClient<{
                    addToCart: string;
                }>(MUTATION, variables);

                return result.addToCart;
            } catch (err) {
                setError(err as Error);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        addToCart,
        loadingAddToCart: loading,
        errorAddToCart: error,
    };
};
