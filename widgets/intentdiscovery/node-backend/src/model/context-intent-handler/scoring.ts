import {AiRecommendationRequest, ProductRequest} from "../../types/intent-recommendations-context";

export function preScoreProducts(payload: AiRecommendationRequest, maxCandidates: number) {
    const { signals } = payload.intent;

    return payload.products.map((product: ProductRequest) => {

        let score = 0;

        for (const [attribute, weights] of Object.entries(signals)) {

            const productValues = product.attributes[attribute];
            if (!productValues) continue;

            for (const value of productValues) {
                if (weights[value]) {
                    score += weights[value];
                }
            }
        }

        return {
            ...product,
            preScore: score
        };
    })
        .sort((a, b) => b.preScore - a.preScore)
        .slice(0, 10);
}