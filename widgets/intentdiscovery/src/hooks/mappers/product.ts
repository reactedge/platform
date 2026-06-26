import type {BaseProduct, GraphqlProduct} from "../../types/infra/magento/product.types.ts";
import {stripHtml} from "../../lib/string.ts";
import type {OptionLabelMap} from "../../domain/intent-discovery.types.ts";

export function mapProduct(p: GraphqlProduct, optionLabelMap: OptionLabelMap): BaseProduct | null {
    if (!p.small_image.url ||  !p.price_range) return null

    return {
        sku: p.sku,
        title: p.name,
        description: stripHtml(p.short_description?.html),
        url: `/${getProductUrl(p)}`,
        imageUrl: p.matched_variant_image?.url?? p.small_image.url,
        price: p.price_range.minimum_price?.final_price,
        attributes: extractAttributes(p, optionLabelMap)
    }
}

const getProductUrl = (product: GraphqlProduct) => {
    if (!product.url_rewrites?.length) return null;

    // Prefer canonical (no category path)
    const canonical = product.url_rewrites.find(
        r => !r.url.includes('/')
    );

    return canonical?.url || product.url_rewrites[0].url;
};

function extractAttributes(
    p: GraphqlProduct,
    optionLabelMap: OptionLabelMap
): Record<string, string[]> {

    const attributes: Record<string, string[]> = {}

    for (const [attributeCode, valueMap] of optionLabelMap.entries()) {
        const rawValue = p[attributeCode]
        if (!rawValue) continue

        const valueIds = normalizeRawValue(rawValue)

        const labels = valueIds
            .map(id => valueMap.get(id))
            .filter(Boolean) as string[]

        if (labels.length > 0) {
            attributes[attributeCode] = labels
        }
    }

    return attributes
}

function normalizeRawValue(raw: unknown): string[] {
    if (!raw) return []

    if (Array.isArray(raw)) {
        return raw.map(v => String(v))
    }

    if (typeof raw === 'string') {
        return raw
            .split(',')
            .map(v => v.trim())
            .filter(Boolean)
    }

    // fallback (numbers, etc.)
    return [String(raw)]
}