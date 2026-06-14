import type {APISuggestion, BaseProduct, EnrichedSuggestion} from "../../../types/infra/magento/product.types.ts";

export function mapSuggestion(
    suggestion: APISuggestion,
    product: BaseProduct
): EnrichedSuggestion {
    return {
        sku: suggestion.sku,
        match: suggestion.match,
        reason: suggestion.reason,
        product: {
            sku: product.sku,
            title: product.title,
            description: product.description,
            url: product.url,
            imageUrl: product.imageUrl,
            price: product.price,
            attributes: product.attributes
        }
    };
}