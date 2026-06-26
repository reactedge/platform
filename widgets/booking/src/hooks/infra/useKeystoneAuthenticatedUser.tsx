import {useEffect, useState} from "react";
import {getError} from "../../lib/error.ts";
import type {KeystoneAuthenticatedUser} from "../../types/infra/keystone";
import {useSystemState} from "../../state/System/useSystemState.ts";

const QUERY = `
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name  
        eventHost {
          id
          name
        }
        eventType {
          id
          name
        }
        eventTypeGroup {
          id
          name
        }
        weekPreference
        cartItems {
          id
          quantity   
          price
          eventType {
            name
          }         
          event {
            id
            day
            startTime 
            endTime             
            eventHost {
              id            
              name
            }                       
          }      
        }  
        role {
          isEventHost
        }           
      }
    }
  }
`;

export function useKeystoneAuthenticatedUser() {
    const [data, setData] = useState<KeystoneAuthenticatedUser>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const load = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<{
                authenticatedItem: KeystoneAuthenticatedUser;
            }>(QUERY);

            setData(result.authenticatedItem);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return {
        keystoneAuthenticatedUser: data,
        userLoading: loading,
        userError: error,
        refetch: load };
}