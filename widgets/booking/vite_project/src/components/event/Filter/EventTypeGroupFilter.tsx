import {useConfigState} from "../../../state/Config/useConfigState.ts";
import {useVisitIntentState} from "../../../state/Intent/useVisitIntentState.ts";
import {FilterSection} from "../FilterSection.tsx";
import {EventTypeGroupOptions} from "./EventTypeGroupFilter/EventTypeGroupOptions.tsx";
import {useState} from "react";

export function EventTypeGroupFilter() {
    const { visitIntent, setEventTypeGroup } = useVisitIntentState();
    const { config } = useConfigState();
    const [isEditing, setIsEditing] = useState(false);

    if (config.eventTypeGroups === undefined) return null;

    const selectedEventTypeGroup = config.eventTypeGroups.find(
        t => t.id === visitIntent.eventTypeGroupId
    );

    if (config.eventTypeGroups.length <= 1) return null;

    return (
        <FilterSection
            title="Appointment type"
            isResolved={!!visitIntent.eventTypeGroupId && !isEditing}
            summary={selectedEventTypeGroup?.label}
            onEdit={() => setIsEditing(true)}
        >
            {isEditing && (
            <EventTypeGroupOptions
                eventTypeGroups={config.eventTypeGroups}
                selectedId={visitIntent.eventTypeGroupId}
                onSelect={(id) => {
                    setEventTypeGroup(id);
                    setIsEditing(false);
                }}
            />)}
        </FilterSection>
    );
}
