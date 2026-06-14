import {formatEventTypeDescription} from "../../../domain/formatters/getEventTypeDescription.ts";
import {formatShortDate, getWeekRangeInfo} from "../../../lib/date.ts";
import {useEventType} from "../../../hooks/domain/useEventType.tsx";
import {Spinner} from "../../global/Spinner.tsx";

interface BookingContextSummaryProps {
    eventTypeId: string;
    weekStart: string;
}

export function BookingContextSummary({
       eventTypeId,
       weekStart
   }: BookingContextSummaryProps) {
    const {eventType, eventTypeLoading} = useEventType(eventTypeId);
    const { weekNumber, startDate, endDate } = getWeekRangeInfo(weekStart);

    if (eventTypeLoading) return <Spinner />
    if (eventType === undefined) return null

    return (
        <div className="booking-context">
            <div className="booking-context__item">
                <h3>{eventType.label}</h3>
                {eventType.description && (
                    <p className="booking-context__description">
                        {formatEventTypeDescription(eventType)}
                    </p>
                )}
            </div>

            <div className="booking-summary">
                All our appointments in the  {" "}
                <strong>Week {weekNumber}</strong>{" "}
                <span className="booking-context__range">
                  ({formatShortDate(startDate)} – {formatShortDate(endDate)})
                </span>
            </div>
        </div>
    );
}
