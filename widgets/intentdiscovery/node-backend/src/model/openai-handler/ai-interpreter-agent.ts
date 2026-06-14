import {OpenAI} from "openai";
import {config} from "../../config";
import {
    AiInterpretationResponse,
    Attribute,
    Intent
} from "../../types/intent-interpretation-context";
import {Stores} from "../../types/intent-accepted-store";
import {getIntentInterpretationPrompt} from "../prompt-handler/loader";

const openai = new OpenAI({ apiKey: config.openai.apiKey });

const InterpretationSchema = {
    name: "interpretation_response",
    schema: {
        type: "object",
        properties: {
            filters: {
                type: "object",
                description: "Selected attribute filters derived from the intent",
                additionalProperties: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            }
        },
        required: ["filters"],
        additionalProperties: false
    }
} as const;

export class OpenaiInterpreterAgent {
    async getIntentFilters(intent: Intent, attributes: Attribute[], promptVersion: string, store: Stores) {
        try {
            const promptData = await getIntentInterpretationPrompt(promptVersion)

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                temperature: 0.2,
                response_format: {
                    type: "json_schema",
                    json_schema: InterpretationSchema
                },
                messages: [
                    {
                        role: "system",
                        content: promptData.instructions +
                            `Respond in ${store === 'fr' ? 'French' : 'English'}.`
                    },
                    {
                        role: "user",
                        content: JSON.stringify({
                            intent,
                            attributes
                        })
                    }
                ]
            })

            const content = completion.choices[0]?.message?.content ?? "{}"

            let parsed: AiInterpretationResponse

            try {
                parsed = JSON.parse(content)
            } catch {
                parsed = { filters: {} }
            }

            return parsed

        } catch (e) {

            console.error("AI interpretation failed:", e)

            return {
                filters: {}
            }
        }
    }
}