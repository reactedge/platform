import {useVisitIntentState} from "../../../state/Intent/useVisitIntentState.ts";
import {getDate} from "../../../lib/date.ts";
import {useEventType} from "../../../hooks/domain/useEventType.tsx";

export function PreferenceSummary() {
    const { visitIntent } = useVisitIntentState();
    const {eventType, eventTypeLoading} = useEventType(visitIntent.eventTypeId);

    if (!visitIntent.eventTypeId || !visitIntent.weekIntent) return null;
    if (eventTypeLoading) return null;

    return (
        <div className="booking-summary">
            All our appointments for{" "}
            <strong>{eventType?.label}</strong>{" "}
            in the week starting{" "}
            <strong>{getDate(visitIntent.weekIntent)}</strong>
        </div>
    );
}
