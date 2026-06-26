// domain/useLoginUser.ts
import {useCallback, useState} from "react";
import type {KeystoneAuthenticationParams} from "../../types/infra/keystone";
import {useSystemState} from "../../state/System/useSystemState.ts";

const MUTATION = `
  mutation AuthenticateUserWithPassword($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name   
          role {
             isEventHost
          }   
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;

interface AuthSuccess {
    __typename: "UserAuthenticationWithPasswordSuccess";
    id: string;
    email: string;
    name: string;
    role: {
        isEventHost: boolean;
    };
}

interface AuthFailure {
    __typename: "UserAuthenticationWithPasswordFailure";
    message: string;
}

type AuthenticateUserResult = AuthSuccess | AuthFailure;

export const useKeystoneAuthenticateUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const authenticate = useCallback(
        async (variables: KeystoneAuthenticationParams) => {
            setLoading(true);
            setError(null);

            try {
                const result = await graphqlClient<{
                    authenticateUserWithPassword: AuthenticateUserResult ;
                }>(MUTATION, variables);

                return result?.authenticateUserWithPassword;
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
        authenticate,
        loading,
        error,
    };
};
