import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {categoryLayereIds} from "../../lib/category.ts";
import {useMemo} from "react";
import {intentToFilter} from "../../lib/option-match.ts";
import {useIntentState} from "../../state/Intent/useIntentState.ts";

type FilterValue =
    | { eq: string | number }
    | { in: (string | number)[] };

export type MagentoProductFilter = Record<string, FilterValue>;

export function useOptionSelectionFilter(categoryData?: CategoryData) {
    const {intentState} = useIntentState()

    const categoryIds = useMemo(
        () => categoryLayereIds(categoryData),
        [categoryData?.id]
    );

    const intentFilter = useMemo(
        () => intentToFilter(intentState),
        [intentState]
    );

    return useMemo(() => {
        const filter: MagentoProductFilter = {
            category_id: {
                in: categoryIds
            }
        };

        Object.entries(intentFilter).forEach(([attribute, value]) => {
            if (Array.isArray(value)) {
                if (value.length === 1) {
                    filter[attribute] = { eq: value[0] }
                } else if (value.length > 1) {
                    filter[attribute] = { in: value }
                }
            } else {
                filter[attribute] = { eq: value }
            }
        })

        return filter;

    }, [categoryIds, intentFilter]);
}