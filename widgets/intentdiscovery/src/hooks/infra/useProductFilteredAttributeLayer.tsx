import {useEffect, useState} from "react";
import {useSystemState} from "../../state/System/useSystemState.ts";
import {getError} from "../../lib/error.ts";
import {type MagentoProductFilter, useOptionSelectionFilter} from "../domain/useOptionSelectionFilter.tsx";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";

const QUERY = `
     query MagentoProducts($filter: ProductAttributeFilterInput!) {
      products(filter: $filter) {
        total_count
        aggregations{
          attribute_code
          label
          count
          options{
            count
            label
            value
          }
        }
      }
    }
`;

export interface MagentoAggregationOption {
    count: number;
    label: string;
    value: string;
    swatch_data?: {
        value: string // "#000000" OR image URL depending on type
        type: "ColorSwatchData" | "ImageSwatchData"
    } | null
}

export interface MagentoAggregation {
    attribute_code: string;
    label: string;
    count: number;
    options: MagentoAggregationOption[];
}

export interface MagentoProducts {
    total_count: number;
    aggregations: MagentoAggregation[];
};

export type ProductAttributesResponse = {
    products: MagentoProducts;
}

export const useProductFilteredAttributeLayer = (categoryData: CategoryData) => {
    const [data, setData] = useState<ProductAttributesResponse>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { graphqlClient } = useSystemState()

    const filter = useOptionSelectionFilter(categoryData)

    const load = async (filter: MagentoProductFilter) => {
        if (!filter) return;

        setLoading(true);
        setError(null);

        try {
            const result = await graphqlClient<ProductAttributesResponse>(
                QUERY,
                { filter }
            );
            setData(result);
        } catch (err: unknown) {
            setError(getError(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(filter);
    }, [filter]);

    return {
        magentoAttributesLayer: data?.products,
        loading,
        error,
        refetch: load
    };
}
