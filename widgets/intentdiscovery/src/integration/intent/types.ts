import type {PersistedIntentV1} from "../../services/intentPersistence/intentPersistence.service.ts";
import type {EnrichedSuggestion} from "../../types/infra/magento/product.types.ts";

export type AttributeOptionScores = Record<string, number>;

export type AttributeFilters = Record<string, AttributeOptionScores>;

export type IntentEngineState = {
    intentText: string
    categoryScore: Record<string, number>
    attributeScore: AttributeFilters
    productScore: Record<string, number>
    priceAffinity: {
        min?: number
        max?: number
        avg?: number
    },
    currentUrl?: string
    recommendations: EnrichedSuggestion[]
    resultCount: number
    status: IntentStatus
    intentInterpreted: boolean;
    intentInterpretationReady: boolean;
    searchReady: boolean;
}

export type IntentSnapshot = {
    intentText: string,
    filtersHash: string,
    recommendations: EnrichedSuggestion[]
}

export type IntentSignal =
    | { type: "status_updated"; status: IntentStatus }
    | { type: "text_updated"; text: string }
    | { type: "category_view"; id: string }
    | { type: "filter_toggle"; attribute: string; value: string }
    | { type: "filter_select"; attribute: string; value: string }
    | { type: "filter_deselect"; attribute: string; value: string }
    | { type: "product_view"; sku: string }
    | { type: "add_to_cart"; sku: string; price: number }
    | { type: "url"; }

export type IntentStatus =
    | "idle"
    | "ready"
    | "filterChanged"
    | "filterReset"
    | "filtersUpdated"
    | "readyToApplyFilters"
    | "canBeInterpreted"
    | "interpreting"
    | "readyToRecommend"
    | "suggestionProcessing"
    | "suggestionSent"
    | "suggestionLoaded"
    | "noSuggestionFound";

export type IntentEvent =
    | { type: "RESULTS_UPDATED"; totalFiltered: number }
    | { type: "FILTER_CHANGED"; attributeCode:string, optionValue:string }
    | { type: "FILTER_RESET" }
    | { type: "INTERPRETATION_STARTED" }
    | { type: "INTERPRETATION_PROCESSING" }
    | { type: "BOOTSTRAP_FROM_PERSISTED_INTENT", payload: PersistedIntentV1 }
    | { type: "INTERPRETATION_REQUESTED" }
    | { type: "INTERPRETATION_READY", payload: { intent: string } }
    | { type: "INTERPRETATION_DONE" }//; filters: AttributeFilter[], intent: string  }
    | { type: "SUGGEST_CLICKED" }
    | { type: "SUGGESTION_SUCCESS"; recommendations: EnrichedSuggestion[], filters: AttributeFilters, intent: string }
    | { type: "SUGGESTION_PROPAGATE"; recommendations: EnrichedSuggestion[], filters: AttributeFilters, intent: string }
    | { type: "SEARCH_PROCESSING" }
    | { type: "SUGGESTION_EMPTY" };