import {fetchBase} from "./fetchBase.ts";
import type {IntentEngineState} from "../../integration/intent/types.ts";
import {fetchFiltered} from "./fetchFiltered.ts";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {categoryLayereIds} from "../../lib/category.ts";
import type { MergedAttribute} from "../../hooks/infra/useMagentoLayeredData.tsx";
import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";
import type {MagentoProducts} from "../../hooks/infra/useProductFilteredAttributeLayer.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import {applyIntentConfig} from "../../lib/attributes.ts";
import type {GraphqlClient} from "../graphql/graphqlClient.ts";



export async function getLayeredNavigation(
    categoryData: CategoryData,
    graphqlClient: GraphqlClient,
    config: IntentDiscoveryDataConfig,
    intentState?: IntentEngineState
): Promise<MagentoLayeredNavigation> {
    const categoryIds = categoryLayereIds(categoryData)

    const [base, filtered] = await Promise.all([
        fetchBase(categoryIds, graphqlClient),
        fetchFiltered(categoryIds, graphqlClient, intentState)
    ])

    const merged = mergeLayerData(base, filtered)
    const attributes = applyIntentConfig(merged, config);

    return {
        attributes,
        totalCount: filtered.total_count,
        baseTotalCount: base.total_count
    }
}

export function mergeLayerData(
    base: MagentoProducts,
    filtered: MagentoProducts
): MergedAttribute[] {
    const baseAggregations = base?.aggregations ?? []
    const filteredAggregations = filtered?.aggregations ?? []

    const filteredMap = new Map(
        filteredAggregations.map(attr => [attr.attribute_code, attr])
    )

    return baseAggregations.map(baseAttr => {
        const filteredAttr = filteredMap.get(baseAttr.attribute_code)

        const filteredOptionsMap = new Map(
            (filteredAttr?.options || []).map(opt => [opt.value, opt])
        )

        return {
            code: baseAttr.attribute_code,
            label: baseAttr.label,
            options: baseAttr.options.map(baseOpt => {
                const filteredOpt = filteredOptionsMap.get(baseOpt.value)

                const filteredCount = filteredOpt?.count ?? 0

                return {
                    value: baseOpt.value,
                    label: baseOpt.label,
                    totalCount: baseOpt.count,
                    filteredCount,
                    isAvailable: filteredCount > 0,
                    visual: baseOpt.swatch_data
                        ? {
                            type:
                                baseOpt.swatch_data.type === "ColorSwatchData"
                                    ? "color"
                                    : "image",
                            value: baseOpt.swatch_data.value,
                        }
                        : undefined
                }
            })
        }
    })
}