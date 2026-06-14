export type BaseProduct = {
    sku: string
    title: string
    description?: string
    url: string
    imageUrl: string
    price: {
        value: number
        currency: string
    }
    attributes?: Record<string, string[]>
}

export type MagentoProduct = {
    sku: string
    name: string
    short_description?: {
        html: string
    }
    small_image: {
        url: string
    }
    url_rewrites: [{
        url: string
    }]
    matched_variant_image: {
        url: string
    }
    price_range: {
        minimum_price: {
            final_price: {
                value: number
                currency: string
            }
        }
    }
}


export type GraphqlProduct = MagentoProduct & Record<string, string | null | undefined>

export type APISuggestion = {
    sku: string
    match: number
    reason: string
}

export type EnrichedSuggestion = APISuggestion & {
    product: BaseProduct
}