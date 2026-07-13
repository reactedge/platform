import type {
    APISuggestion,
    EnrichedSuggestion,
    GraphqlProduct
} from "../../../types/infra/magento/product.types.ts";
import {mapSuggestion} from "./mapSuggestion.ts";
import {mapProduct} from "../../../hooks/mappers/product.ts";
import type {OptionLabelMap} from "../../../domain/intent-discovery.types.ts";

export function enrichSuggestions(
    suggestions: APISuggestion[],
    productData: GraphqlProduct[],
    optionLabelMap: OptionLabelMap
): EnrichedSuggestion[] {
    const productMap = new Map(productData.map(p => [p.sku, p]));

    return suggestions
        .map(s => {
            const product = productMap.get(s.sku);
            if (!product) return null;
            const finalProduct = mapProduct(product, optionLabelMap)
            if (!finalProduct) return null;

            return mapSuggestion(s, finalProduct);
        })
        .filter((s): s is EnrichedSuggestion => s !== null);
}