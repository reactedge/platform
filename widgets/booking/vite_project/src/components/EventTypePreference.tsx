import {Spinner} from "./global/Spinner.tsx";
import {ErrorState} from "./global/ErrorState.tsx";
import {useEventTypes} from "../hooks/domain/useEventTypes.tsx";
import {useVisitIntentState} from "../state/Intent/useVisitIntentState.ts";
import type {PreferenceProps} from "../types/domain/preference.type.ts";
import {formatEventTypeDescription} from "../domain/formatters/getEventTypeDescription.ts";
import {useMediaQuery} from "../hooks/ui/useMediaQuery.tsx";

export function EventTypePreference({
    value,
    onSelect
}: PreferenceProps) {
    const { visitIntent } = useVisitIntentState();
    const { eventTypes, eventTypesLoading, eventTypesError } = useEventTypes(visitIntent.eventTypeGroupId);
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (eventTypesLoading || eventTypes === undefined) return <Spinner />;
    if (eventTypesError) return <ErrorState />;

    return (
        <div className="booking-options booking-options--type"
             data-layout={isMobile ? 'mobile' : 'desktop'}>
            {eventTypes.map(option => (
                <button
                    key={option.id}
                    type="button"
                    className={`booking-option ${value === option.id ? 'is-active' : ''}`}
                    onClick={() => onSelect(option.id)}
                >
                    <span className="booking-option-label">{option.label}</span>
                    {option.description && (
                        <span className="booking-option-desc">{formatEventTypeDescription(option)}</span>
                    )}
                </button>
            ))}
        </div>
    )
}
