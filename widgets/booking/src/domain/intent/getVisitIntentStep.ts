import type {VisitIntentInfoState} from "../../state/Intent/type.ts";
import type {BookingStep} from "../../types/domain/bookingsystem.type.ts";

export function getVisitIntentStep(
    visitIntent: VisitIntentInfoState
): BookingStep {
    if (!visitIntent.eventTypeGroupId) return "EventTypeGroup";
    if (!visitIntent.eventTypeId) return "EventType";
    if (!visitIntent.weekIntent) return "Week";
    //if (!visitIntent.hostId) return "Host";

    return "Ready";
}
