export interface AiRecommendationRequest {
    intent: {
        signals: Record<string, Record<string, number>>
    }
    products: ProductRequest[]
}

export interface ProductRequest {
    title: string
    shortDescription?: string
    attributes: Record<string, string[]>
}

interface MagentoProduct {
    name: string
    short_description?: string
    attributes: Record<string, string> // already label-mapped
}

export interface AiRecommendationResponse {
    suggestions: MagentoProduct[]
    message?: string
}

export type ModelInput = {
    intent: Record<string, Record<string, number>>;
    products: {
        title: string;
        shortDescription?: string;
        attributes: Record<string, string[]>;
    }[];
};