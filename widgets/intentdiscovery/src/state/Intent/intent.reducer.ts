import type {IntentEngineState, IntentEvent} from "../../integration/intent/types.ts";

function reduceInterpretationEvent(state: IntentEngineState, event: IntentEvent): IntentEngineState | undefined {
    switch (event.type) {
        case "INTERPRETATION_STARTED":
            return {...state, intentInterpretationReady: false, status: "idle"};
        case "INTERPRETATION_READY":
            return {...state, intentInterpretationReady: true, status: "canBeInterpreted"};
        case "INTERPRETATION_PROCESSING":
            return {...state, intentInterpreted: true, status: "suggestionProcessing"};
        case "INTERPRETATION_DONE":
            return {...state, intentInterpreted: true, status: "readyToRecommend"};
        case "FILTER_CHANGED":
            return {...state, status: "filterChanged"};
        case "FILTER_RESET":
            return {...state, status: "filterReset"};
        default:
            return undefined;
    }
}

export function intentReducer(state: IntentEngineState, event: IntentEvent): IntentEngineState {
    const interpretation = reduceInterpretationEvent(state, event);
    if (interpretation) return interpretation;

    switch (event.type) {
        case "SUGGEST_CLICKED":
            return state.resultCount === 0 ? state : {...state, status: "suggestionProcessing"};
        case "SUGGESTION_SUCCESS":
            return {...state, recommendations: event.recommendations, status: "suggestionSent"};
        case "SUGGESTION_PROPAGATE":
            return {...state};
        case "BOOTSTRAP_FROM_PERSISTED_INTENT":
            return {
                ...state,
                attributeScore: event.payload.attributeScore,
                categoryScore: event.payload.categoryScore,
                intentInterpreted: true,
                intentInterpretationReady: true,
                searchReady: true,
                status: "readyToApplyFilters",
            };
        case "SEARCH_PROCESSING":
            return {...state, status: "suggestionProcessing", recommendations: []};
        case "SUGGESTION_EMPTY":
            return {...state, status: "noSuggestionFound", recommendations: []};
        default:
            return state;
    }
}
