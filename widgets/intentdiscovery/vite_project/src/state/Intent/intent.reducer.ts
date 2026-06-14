import type {IntentEngineState, IntentEvent} from "../../integration/intent/types.ts";

export function intentReducer(
    state: IntentEngineState,
    event: IntentEvent
): IntentEngineState {
    switch (event.type) {
        case "INTERPRETATION_STARTED":
            return {
                ...state,
                intentInterpretationReady: false,
                status: "idle"
            };

        case "INTERPRETATION_READY":
            return {
                ...state,
                intentInterpretationReady: true,
                status: "canBeInterpreted"
            };

        case "INTERPRETATION_PROCESSING":
            return {
                ...state,
                intentInterpreted: true,
                status: "suggestionProcessing"
            };

        case "INTERPRETATION_DONE":
            return {
                ...state,
                intentInterpreted: true,
                status: "readyToRecommend"
            };

        case "FILTER_CHANGED":
            return {
                ...state,
                status: "filterChanged"
            };

        case "FILTER_RESET":
            return {
                ...state,
                status: "filterReset"
            };

        case "SUGGEST_CLICKED":
            if (state.resultCount === 0) return state;
            return {
                ...state,
                status: "suggestionProcessing"
            };

        case "SUGGESTION_SUCCESS":
            return {
                ...state,
                recommendations: event.recommendations,
                status: "suggestionSent"
            };

        case "SUGGESTION_PROPAGATE":
            return {
                ...state
            };

        case "BOOTSTRAP_FROM_PERSISTED_INTENT":
            return {
                ...state,
                attributeScore: event.payload.attributeScore,
                categoryScore: event.payload.categoryScore,
                intentInterpreted: true,
                intentInterpretationReady: true,
                searchReady: true,
                status: "readyToApplyFilters"
            };

        case "SEARCH_PROCESSING":
            return {
                ...state,
                status: "suggestionProcessing",
                recommendations: []
            };

        case "SUGGESTION_EMPTY":
            return {
                ...state,
                status: "noSuggestionFound",
                recommendations: []
            };

        default:
            return state;
    }
}