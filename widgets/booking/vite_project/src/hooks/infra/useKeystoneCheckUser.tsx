import {useCallback, useState} from "react";
import {useSystemState} from "../../state/System/useSystemState.ts";
import type { KeystoneCheckUserParams} from "../../types/infra/keystone/user/KeystoneUsers.types.ts";
import {asVariables} from "../../lib/graphql.ts";

const QUERY = `
  query CheckUser($email: String!) {
    users(where: { email: { equals: $email } }) {
      id
    }
  }
`;

export const useKeystoneCheckUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const checkUserByEmail = useCallback(async (variables: KeystoneCheckUserParams) => {
        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<{
                users: { id: string }[]
            }>(QUERY, asVariables(variables));

            return result.users;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        checkUserByEmail,
        loadingCheckUser: loading,
        errorCheckUser: error,
    };
};
