import {AiRecommendationResponse, ModelInput} from "../types/intent-recommendations-context";
import {AiInterpretationResponse, Attribute, Intent} from "../types/intent-interpretation-context";
import {OpenaiRecommendationAgent} from "./openai-handler/ai-recommendation-agent";
import {OpenaiInterpreterAgent} from "./openai-handler/ai-interpreter-agent";
import {Stores} from "../types/intent-accepted-store";


export class ContextIntentHandler {
    getIntentSuggestions = async (
        modelInput: ModelInput,
        promptVersion: string,
        store: Stores = 'uk'
    ): Promise<AiRecommendationResponse> => {
        const openaiAgent = new OpenaiRecommendationAgent()
        return await openaiAgent.getSuggestion(modelInput, promptVersion, store);
    }

    getFiltersFromIIntent = async (
        intent: Intent ,
        attributes: Attribute[],
        promptVersion: string,
        store: Stores = 'uk'
    ): Promise<AiInterpretationResponse> => {
        const openaiAgent = new OpenaiInterpreterAgent()
        return await openaiAgent.getIntentFilters(intent, attributes, promptVersion, store);
    }
}