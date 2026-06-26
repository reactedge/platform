import type {IntentEvent} from "../../integration/intent/types.ts";
import {getFiltersHash} from "../../lib/attributes.ts";
import {intentSnapshotService} from "../../services/intentPersistence/intentSnapshot.service.ts";

export function runIntentEffects(
    event: IntentEvent
) {
    switch (event.type) {

        case "INTERPRETATION_READY":
            intentSnapshotService.merge({
                intentText: event.payload.intent
            });
            break;

        case "FILTER_CHANGED":
            window.dispatchEvent(
                new CustomEvent("reactedge:filter", {
                    detail: event
                })
            );
            break;

        case "SUGGESTION_SUCCESS":
            window.dispatchEvent(
                new CustomEvent("reactedge:syncfilters", {
                    detail: event
                })
            );

            intentSnapshotService.merge({
                filtersHash: getFiltersHash(event.filters),
                recommendations: event.recommendations
            });
            break;

        case "SUGGESTION_PROPAGATE":
            window.dispatchEvent(
                new CustomEvent("reactedge:recommendations", {
                    detail: { recommendations: event.recommendations }
                })
            );
            break;
    }
}