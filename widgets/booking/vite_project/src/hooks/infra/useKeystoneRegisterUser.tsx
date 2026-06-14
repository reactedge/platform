import {useCallback, useState} from "react";
import {useSystemState} from "../../state/System/useSystemState.ts";
import type {
    KeystoneRegisterUserParams,
    RegisterUserParams
} from "../../types/infra/keystone/user/KeystoneUsers.types.ts";
import {useConfigState} from "../../state/Config/useConfigState.ts";
import {asVariables} from "../../lib/graphql.ts";

const MUTATION = `
    mutation RegisterUser($data: UserCreateInput!) {
        createUser(data: $data) {
          id
        }
      }
`;

export const useKeystoneRegisterUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()
    const { config } = useConfigState();

    const registerUser = useCallback(
        async (variables: RegisterUserParams) => {
            setLoading(true);
            setError(null);

            if (!config.venue?.id) {
                throw new Error('Missing venue id in config');
            }

            const enrichedVariables: KeystoneRegisterUserParams = {
                ...variables,
                data: {
                    ...variables,
                    venue: {
                        connect: {
                            id: config.venue.id,
                        },
                    },
                },
            };

            try {
                const result = await graphqlClient<{
                    createUser: { id: string; }
                }>(MUTATION, asVariables(enrichedVariables));

                return result.createUser.id;
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
        registerUser,
        loadingRegisterUser: loading,
        errorRegisterUser: error,
    };
};