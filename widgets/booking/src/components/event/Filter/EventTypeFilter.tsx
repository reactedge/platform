import {useVisitIntentState} from "../../../state/Intent/useVisitIntentState.ts";
import {useEventTypes} from "../../../hooks/domain/useEventTypes.tsx";
import {FilterSection} from "../FilterSection.tsx";
import {EventTypeOptions} from "./EventTypeFilter/EventTypeOptions.tsx";
import {useState} from "react";

export function EventTypeFilter() {
    const { visitIntent, setEventType } = useVisitIntentState();
    const { eventTypes, eventTypesLoading } = useEventTypes(visitIntent.eventTypeGroupId);
    const [isEditing, setIsEditing] = useState(false);

    if (!visitIntent.eventTypeGroupId || eventTypes === undefined || eventTypesLoading) return null;

    const selectedEventType = eventTypes.find(
        t => t.id === visitIntent.eventTypeId
    );

    return (
        <FilterSection
            title="Event type"
            isResolved={!!visitIntent.eventTypeId && !isEditing}
            summary={selectedEventType?.label}
            onEdit={() => setIsEditing(true)}
        >
            {isEditing && (<EventTypeOptions
                eventTypes={eventTypes}
                selectedId={visitIntent.eventTypeId}
                onSelect={(id) => {
                    setEventType(id);
                    setIsEditing(false);
                }}
            />)}
        </FilterSection>
    )
}
