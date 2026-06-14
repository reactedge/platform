import type {MagentoProductFilter} from "../../hooks/domain/useOptionSelectionFilter.tsx";
import {intentToFilter} from "../../lib/option-match.ts";
import type {IntentEngineState} from "../../integration/intent/types.ts";

export const getCategoryFilter = (categoryIds: number[]) => {
    const filter: MagentoProductFilter = {
        category_id: {
            in: categoryIds
        }
    };

    return filter
}

export const getAttributesFilter = (categoryIds: number[], intentState?: IntentEngineState) => {
    const filter = getCategoryFilter(categoryIds)
    const intentFilter = intentToFilter(intentState);

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

    return filter
}