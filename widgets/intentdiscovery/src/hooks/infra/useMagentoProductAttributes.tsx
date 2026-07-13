import {useEffect, useState} from "react";
import {useSystemState} from "../../state/System/useSystemState.ts";
import {getError} from "../../lib/error.ts";
import type {MagentoAttribute} from "../../types/infra/magento/attribute.types.ts";

const QUERY = `
    {
      attributesList(entityType: CATALOG_PRODUCT, filters: {is_filterable: true}) {
        errors {
          message
          type
        }
        items {
          code
          frontend_input
          label
        }
      }
    }
`;

type AttributeResponse = {
    attributesList: {
        items: MagentoAttribute[]
    }
}

export function useProductAttributes() {
    const [data, setData] = useState<AttributeResponse>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const load = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<AttributeResponse>(
                QUERY, {}
            );
            setData(result);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return { magentoAttributes: data?.attributesList.items, loading, error, refetch: load };
}
