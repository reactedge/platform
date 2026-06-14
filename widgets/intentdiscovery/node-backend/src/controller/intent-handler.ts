import { Request, Response } from "express";
import {ContextIntentHandler} from "../model/context-intent-handler";
import {preScoreProducts} from "../model/context-intent-handler/scoring";
import {AiRecommendationRequest} from "../types/intent-recommendations-context";
import {AiInterpretationRequest} from "../types/intent-interpretation-context";
import {Stores} from "../types/intent-accepted-store";
import {getIntentPrompt} from "../model/prompt-handler/loader";

export class IntentHandler {
    buildContextSuggestion = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload = req.body as AiRecommendationRequest;
            const store = req.get('Store') as Stores;
            const promptVersion = req.get('X-Prompt-Version') || 'v2';

            if (!payload?.products?.length) {
                res.json({ suggestions: [], message: "No products to evaluate." });
                return
            }

            const candidates = preScoreProducts(payload, 12)

            const modelInput = {
                intent: payload.intent.signals,
                products: candidates.map(p => ({
                    title: p.title,
                    attributes: p.attributes,
                    shortDescription: p.shortDescription ? p.shortDescription.slice(0, 240) : undefined
                }))
            };

            const IntentHandler = new ContextIntentHandler()
            const prompt = await getIntentPrompt(promptVersion)
            const suggestions = await IntentHandler.getIntentSuggestions(modelInput, prompt, store);

            res.json(suggestions);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    }

    getFiltersFromIntent = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const body = req.body
            const store = req.get('Store') as Stores;
            const promptVersion = req.get('X-Prompt-Version') || 'v2';

            if (!this.isValidIntentRequest(body)) {
                res.status(400).json({
                    error: "Invalid interpretation request payload"
                })
                return
            }

            const { intent, attributes } = body

            const IntentHandler = new ContextIntentHandler()
            const filters = await IntentHandler.getFiltersFromIIntent(intent, attributes, promptVersion, store);

            res.json(filters);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    }

    isValidIntentRequest = (body: any): body is AiInterpretationRequest => {
        return (
            body &&
            typeof body === "object" &&
            body.intent &&
            typeof body.intent.text === "string" &&
            Array.isArray(body.attributes)
        )
    }

    dummy = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { intent } = req.body
            const text: string = intent?.text ?? ""

            const filters: Record<string, string> = {}

            await new Promise(resolve => setTimeout(resolve, 500))

            filters.color = "58"
            /*filters.climate = "202"

            if (text.includes("red")) {
                filters.color = "red"
            }

            if (text.includes("jacket")) {
                filters.category = "jackets"
            }

            if (text.includes("hiking")) {
                filters.activity = "hiking"
            }*/

            res.json({filters})

        } catch (err) {
            console.error(err)
            res.status(500).json({
                error: "Server error"
            })
        }
    }
}