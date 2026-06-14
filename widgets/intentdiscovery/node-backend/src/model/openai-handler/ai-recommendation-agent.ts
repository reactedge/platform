import {OpenAI} from "openai";
import {config} from "../../config";
import {AiRecommendationResponse} from "../../types/intent-recommendations-context";
import {Stores} from "../../types/intent-accepted-store";

const openai = new OpenAI({ apiKey: config.openai.apiKey });

const SuggestionSchema = {
    name: "AiRecommendationResponse",
    strict: true,
    schema: {
        type: "object",
        additionalProperties: false,
        properties: {
            message: { type: "string" },
            suggestions: {
                type: "array",
                maxItems: 5,
                items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        title: { type: "string" },
                        confidence: { type: "number", minimum: 0, maximum: 1 },
                        reason: { type: "string" }
                    },
                    required: ["title", "confidence", "reason"]
                }
            }
        },
        required: ["message", "suggestions"]
    }
} as const;

export class OpenaiRecommendationAgent {
    getSuggestion = async (modelInput: any, prompt: string, store: Stores) => {
        try {
            const completion = await openai.chat.completions.create({
                model: config.openai.model,
                temperature: config.openai.performance,
                response_format: {
                    type: "json_schema",
                    json_schema: SuggestionSchema
                },
                messages: [
                    {
                        role: "system",
                        content: prompt +
                            `Respond in ${store === 'fr' ? 'French' : 'English'}.`
                    },
                    {
                        role: "user",
                        content: JSON.stringify(modelInput)
                    }
                ]
            });

            const content = completion.choices[0]?.message?.content ?? "{}";
            const parsed = JSON.parse(content) as AiRecommendationResponse;
            parsed.suggestions = (parsed.suggestions ?? []).slice(0, 5);

            return parsed;
        } catch (e: any) {
            return {
                message: "Unable to generate AI recommendations.",
                suggestions: []
            }
        }
    }
}