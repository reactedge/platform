import { OpenAI } from "openai";
import { config } from "../../config";
import { getRepairPrompt } from "../../repair/prompt-loader";
import { AiRepairResponse, Assessment } from "../../types";

const openai = new OpenAI({ apiKey: config.openai.apiKey });

const RepairSchema = {
    name: "repair_response",
    schema: {
        type: "object",
        properties: {
            summary: {
                type: "string"
            },
            proposals: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        target: {
                            type: "string"
                        },
                        strategy: {
                            type: "string",
                            enum: [
                                "truncate",
                                "rewrite",
                                "manual_review"
                            ]
                        },
                        value: {
                            type: "string"
                        },
                        reason: {
                            type: "string"
                        },
                        approvalRequired: {
                            type: "boolean"
                        }
                    },
                    required: [
                        "target",
                        "strategy",
                        "value",
                        "reason",
                        "approvalRequired"
                    ],
                    additionalProperties: false
                }
            }
        },
        required: [
            "summary",
            "proposals"
        ],
        additionalProperties: false
    }
} as const;

export class OpenaiRepairAgent {
    async getSuggestions(assessment: Assessment, promptVersion: string) {
        try {
            const promptInstructions = await getRepairPrompt(promptVersion)

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                temperature: 0.2,
                response_format: {
                    type: "json_schema",
                    json_schema: RepairSchema
                },
                messages: [
                    {
                        role: "system",
                        content: promptInstructions
                    },
                    {
                        role: "user",
                        content: JSON.stringify({
                            widget: assessment.instance,
                            issues: assessment.issues,
                            matchedRules: assessment.matches
                        })
                    }
                ]
            })

            const content = completion.choices[0]?.message?.content ?? "{}"

            let parsed: AiRepairResponse

            try {
                parsed = JSON.parse(content)
            } catch {
                parsed = {
                    summary: "No repair suggestions available.",
                    proposals: []
                }
            }

            return parsed

        } catch (e) {

            console.error("AI Repair failed:", e)

            return {
                summary: "No repair suggestions available.",
                proposals: []
            };
        }
    }
}